/* eslint-disable no-unused-vars */

import { Box, useStyleConfig } from "@chakra-ui/react";
import React, { Component }  from 'react';
function MainPanel(props) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("MainPanel", { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}

export default MainPanel;
