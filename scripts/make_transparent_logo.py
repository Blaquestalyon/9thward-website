"""
Convert public/logo.jpg (white background) into public/logo.png (transparent bg).

Strategy: flood-fill from the four corners inward, only removing pixels that are
"near white" (all channels >= 245). This preserves any white/highlight pixels
that live inside the crosshair/turntable artwork itself (they're not connected
to the outer white region).
"""
from PIL import Image
from collections import deque

SRC = "/home/user/workspace/9th-ward-site/public/logo.jpg"
DST = "/home/user/workspace/9th-ward-site/public/logo.png"
NEAR_WHITE_THRESHOLD = 240  # per-channel min value considered "background"

im = Image.open(SRC).convert("RGBA")
w, h = im.size
px = im.load()

def is_near_white(rgba):
    r, g, b, _ = rgba
    return r >= NEAR_WHITE_THRESHOLD and g >= NEAR_WHITE_THRESHOLD and b >= NEAR_WHITE_THRESHOLD

visited = [[False] * h for _ in range(w)]
q = deque()

# Seed the queue from any near-white pixel along the four edges
for x in range(w):
    for y in (0, h - 1):
        if is_near_white(px[x, y]) and not visited[x][y]:
            visited[x][y] = True
            q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if is_near_white(px[x, y]) and not visited[x][y]:
            visited[x][y] = True
            q.append((x, y))

removed = 0
while q:
    x, y = q.popleft()
    px[x, y] = (255, 255, 255, 0)
    removed += 1
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny] and is_near_white(px[nx, ny]):
            visited[nx][ny] = True
            q.append((nx, ny))

im.save(DST, "PNG", optimize=True)
print(f"wrote {DST} — removed {removed} background pixels ({removed*100/(w*h):.1f}%)")
