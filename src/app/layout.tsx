import type {Metadata} from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/newsreader';
import './globals.css';
export const metadata:Metadata={title:'Relay — Partner intelligence',description:'A synthetic Product Operations demo. Connect partner feedback to evidence-based decisions and follow-through.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
