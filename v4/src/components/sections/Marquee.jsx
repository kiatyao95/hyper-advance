import InfiniteMovingCards from '../21st/InfiniteMovingCards';

const BRANDS = [
  { quote: 'Aiphone', name: 'Authorised Brand', title: 'Audio & Video Intercom' },
  { quote: 'Austco', name: 'Authorised Brand', title: 'Nurse Call System' },
  { quote: 'Lutron', name: 'Authorised Brand', title: 'Lighting Control' },
  { quote: 'Amperes', name: 'Authorised Brand', title: 'Public Address' },
  { quote: 'Fagor', name: 'Authorised Brand', title: 'SMATV' },
  { quote: 'Bodet', name: 'Authorised Brand', title: 'Master Clock' },
  { quote: 'Esa Grimma', name: 'Authorised Brand', title: 'Isolated Power Supply' },
  { quote: 'AJB', name: 'Authorised Brand', title: 'Building Intercom' },
];

export default function Marquee() {
  return <InfiniteMovingCards items={BRANDS} speed="normal" direction="left" />;
}
