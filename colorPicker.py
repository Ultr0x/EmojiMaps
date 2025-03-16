import cv2
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Button

selected_pixels = []
fig = None
ax_img = None
image = None
ax_reset = None
button_reset = None


def update_console_info():
    if not selected_pixels:
        print("No pixels selected.")
        return
    arr = np.array(selected_pixels)
    min_vals = arr.min(axis=0)
    max_vals = arr.max(axis=0)

    print(f"Selected Pixels (R, G, B): {selected_pixels}")
    print(f"Min RGB = {min_vals}, Max RGB = {max_vals}")


def onclick(event):
    if event.inaxes != ax_img:
        return
    x = int(event.xdata)
    y = int(event.ydata)

    b, g, r = image[y, x]

    selected_pixels.append((int(r), int(g), int(b)))

    update_console_info()


def reset_points(event):
    global selected_pixels
    selected_pixels = []
    print("Points have been reset.")
    update_console_info()


def main():
    global fig, ax_img, ax_reset, button_reset, image

    image_path = '/Users/janswidzinski/Code/Domestika/sketches/europe.jpg'
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        raise FileNotFoundError(f"Could not load image from {image_path}")

    image = img_bgr

    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    fig, ax_img = plt.subplots()
    plt.subplots_adjust(bottom=0.2)

    ax_img.imshow(img_rgb)
    ax_img.set_title("Click on the image to select pixels (RGB).")

    ax_img.axis("off")

    ax_reset = plt.axes([0.4, 0.05, 0.2, 0.075])
    button_reset = Button(ax_reset, "Reset Points")
    button_reset.on_clicked(reset_points)

    cid = fig.canvas.mpl_connect("button_press_event", onclick)

    update_console_info()
    plt.show()

if __name__ == "__main__":
    main()
