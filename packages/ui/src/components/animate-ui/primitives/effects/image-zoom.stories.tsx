import { ImageZoom as ImageZoomImpl } from "./image-zoom"

export default {
  title: "Animation/Interactions/Image Zoom",
  component: ImageZoomImpl,
  argTypes: {
    zoomScale: { control: { type: "range", min: 1, max: 6, step: 0.5 } },
    zoomOnClick: { control: "boolean" },
    zoomOnHover: { control: "boolean" },
    disabled: { control: "boolean" },
    width: { control: "text" },
    height: { control: "text" },
    transition: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {
    zoomScale: 2.5,
    zoomOnClick: true,
    zoomOnHover: true,
    disabled: false,
    width: "320px",
    height: "240px",
  },
}

export const ImageZoomEffects = (args: any) => (
  <ImageZoomImpl {...args}>
    <img
      alt="A Pembroke Welsh Corgi standing outdoors in autumn leaves"
      src="https://www.akc.org/wp-content/uploads/2017/11/Pembroke-Welsh-Corgi-standing-outdoors-in-the-fall.jpg"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </ImageZoomImpl>
)
