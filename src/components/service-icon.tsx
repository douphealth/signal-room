import { Activity } from "lucide-react";
import {
  siAnthropic,
  siAsana,
  siBitbucket,
  siCanva,
  siCircleci,
  siClerk,
  siCloudflare,
  siCloudinary,
  siConfluence,
  siDeepgram,
  siDigitalocean,
  siDiscord,
  siDocker,
  siDropbox,
  siFigma,
  siFlydotio,
  siGithub,
  siJira,
  siLinear,
  siMailgun,
  siMongodb,
  siNetlify,
  siNotion,
  siNpm,
  siOpenai,
  siPlanetscale,
  siReddit,
  siRender,
  siReplit,
  siResend,
  siSentry,
  siShopify,
  siSupabase,
  siTrello,
  siTwilio,
  siUpstash,
  siVercel,
  siWebflow,
  siZapier,
  siZoom,
} from "simple-icons";

const ICONS: Record<string, { path: string }> = {
  openai: siOpenai,
  claude: siAnthropic,
  cloudflare: siCloudflare,
  notion: siNotion,
  figma: siFigma,
  canva: siCanva,
  shopify: siShopify,
  github: siGithub,
  vercel: siVercel,
  supabase: siSupabase,
  discord: siDiscord,
  render: siRender,
  digitalocean: siDigitalocean,
  deepgram: siDeepgram,
  netlify: siNetlify,
  flyio: siFlydotio,
  planetscale: siPlanetscale,
  upstash: siUpstash,
  clerk: siClerk,
  sentry: siSentry,
  npm: siNpm,
  docker: siDocker,
  circleci: siCircleci,
  bitbucket: siBitbucket,
  linear: siLinear,
  jira: siJira,
  confluence: siConfluence,
  trello: siTrello,
  asana: siAsana,
  zoom: siZoom,
  dropbox: siDropbox,
  twilio: siTwilio,
  resend: siResend,
  mailgun: siMailgun,
  cloudinary: siCloudinary,
  webflow: siWebflow,
  zapier: siZapier,
  mongodb: siMongodb,
  reddit: siReddit,
  replit: siReplit,
};

export function ServiceIcon({
  source,
  className = "h-5 w-5",
}: {
  source: string;
  className?: string;
}) {
  const icon = ICONS[source];
  return icon ? (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  ) : (
    <Activity aria-hidden="true" className={className} />
  );
}
