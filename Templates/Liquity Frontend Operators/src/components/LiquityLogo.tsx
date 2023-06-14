import React from "react";
import { Box, Image } from "theme-ui";
import { useLiquity } from "../hooks/LiquityContext";

type LiquityLogoProps = React.ComponentProps<typeof Box> & {
  height?: number | string;
};

export const LiquityLogo: React.FC<LiquityLogoProps> = ({
  height,
  ...boxProps
}) => {
  const {
    config: { avatar },
  } = useLiquity();

  return (
    <Box sx={{ lineHeight: 0 }} {...boxProps}>
      {/* <Image src="./lusd-icon.png" sx={{ height }} /> */}
      <Image src={avatar ? avatar : "./lusd-icon.png"} sx={{ height }} />
    </Box>
  );
};
