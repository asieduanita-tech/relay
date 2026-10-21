'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="boot-loading"><h1>Relay could not load this view.</h1><p>Your saved demo data is retained. Please try again.</p><button className="button primary" onClick={reset}>Try again</button></div>}
