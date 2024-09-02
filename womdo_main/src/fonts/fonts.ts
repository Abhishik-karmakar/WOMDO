
import { Bubblegum_Sans } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
export const bubblegumSans = Bubblegum_Sans({
    subsets: ['latin'],
    display: 'swap',
    weight: ["400",],
    variable: "--font-bubblegum-sans",
})