"""Builds the link-preview cards and app icons in public/.

    python scripts/share-card/make_share_images.py

Needs Google Chrome and Pillow (pip install pillow). Re-run after changing
card.html, the hero photo or the logo mark.
"""

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent.parent / "public"
BONE = (244, 243, 239)

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "google-chrome",
    "chromium",
]


def find_chrome() -> str:
    for candidate in CHROME_CANDIDATES:
        if Path(candidate).exists() or shutil.which(candidate):
            return candidate
    sys.exit("Google Chrome not found; add its path to CHROME_CANDIDATES.")


def render_card(chrome: str, lang: str) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "card.png"
        subprocess.run(
            [
                chrome,
                "--headless=new",
                "--disable-gpu",
                "--hide-scrollbars",
                "--allow-file-access-from-files",
                "--force-device-scale-factor=1",
                "--window-size=1200,630",
                "--virtual-time-budget=8000",
                f"--screenshot={png}",
                (HERE / "card.html").as_uri() + f"?lang={lang}",
            ],
            check=True,
            capture_output=True,
        )
        out = PUBLIC / "share" / f"share-{lang}.jpg"
        out.parent.mkdir(exist_ok=True)
        # JPEG under ~300 KB: every preview app accepts it, WhatsApp included.
        Image.open(png).convert("RGB").crop((0, 0, 1200, 630)).save(out, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"{out.relative_to(PUBLIC.parent)}  {out.stat().st_size // 1024} KB")


def make_icon(mark: Image.Image, size: int, name: str, padding: float, background: bool) -> None:
    canvas = Image.new("RGBA", (size, size), BONE + (255,) if background else (0, 0, 0, 0))
    inner = round(size * (1 - 2 * padding))
    icon = mark.copy()
    icon.thumbnail((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
    (canvas.convert("RGB") if background else canvas).save(PUBLIC / name, optimize=True)
    print(f"public/{name}")


def main() -> None:
    chrome = find_chrome()
    for lang in ("en", "ar"):
        render_card(chrome, lang)

    mark = Image.open(PUBLIC / "brand" / "overtop-mark.png").convert("RGBA")
    mark = mark.crop(mark.getbbox())
    make_icon(mark, 32, "favicon-32.png", padding=0.02, background=False)
    make_icon(mark, 180, "apple-touch-icon.png", padding=0.14, background=True)
    make_icon(mark, 192, "icon-192.png", padding=0.12, background=True)
    make_icon(mark, 512, "icon-512.png", padding=0.12, background=True)


if __name__ == "__main__":
    main()
