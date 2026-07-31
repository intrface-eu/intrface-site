import { PipelineSteps } from "@intrface/web";

export const ProfileToUrl = () => (
  <PipelineSteps
    steps={[
      { name: "Read the Instagram profile", body: "We start from what the business already publishes — posts, captions, photos, opening hours." },
      { name: "Pull the content apart", body: "Services, prices, location and tone of voice get sorted into the pages the site will need." },
      { name: "Take the brand as tokens", body: "Colour, type and spacing are lifted from the client's own material, so the site looks like them." },
      { name: "Build it, Croatian first", body: "Static pages, Croatian as the primary language, English alongside it." },
      { name: "Check every page automatically", body: "An automated pass walks every page before anyone sees it." },
      { name: "Put it live on their own address", body: "The client gets a URL they can put straight in their Instagram bio." },
    ]}
  />
);
