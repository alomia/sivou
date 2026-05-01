import "@radix-ui/themes/styles.css";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SivouApp } from './SivouApp'

import { Theme } from '@radix-ui/themes';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance='dark' radius='large'>
      <SivouApp />
    </Theme>
  </StrictMode>,
)
