import { css } from '@emotion/react';

const fontGenerator = (weight: number, size: number, lineHeight: number) => css`
  font-family: 'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  font-weight: ${weight};
  font-size: ${size}rem;
  line-height: ${lineHeight}%;
`;

const font = {
  H1: fontGenerator(700, 2.25, 140),
  H2: fontGenerator(700, 1.75, 140),
  H3: fontGenerator(600, 1.5, 140),
  H4: fontGenerator(600, 1.25, 140),
  H5: fontGenerator(600, 1.125, 140),
  p1: fontGenerator(400, 1.125, 160),
  p2: fontGenerator(400, 1, 160),
  p3: fontGenerator(400, 0.875, 160),
  caption: fontGenerator(400, 0.75, 160),
  btn1: fontGenerator(600, 1.125, 140),
  btn2: fontGenerator(600, 1, 140),
  context: fontGenerator(500, 0.875, 140),
};

export default font;
