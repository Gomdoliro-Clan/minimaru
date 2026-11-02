'use client';

import { css, Global } from '@emotion/react';
import color from './color';

const GlobalStyle = () => (
  <Global
    styles={css`
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        background-color: ${color.white};
        color: ${color.gray900};
        font-family: 'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR',
          sans-serif;
      }

      button {
        border: none;
        background: none;
        cursor: pointer;
        font-family: inherit;
      }

      input,
      textarea,
      select {
        font-family: inherit;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    `}
  />
);

export default GlobalStyle;
