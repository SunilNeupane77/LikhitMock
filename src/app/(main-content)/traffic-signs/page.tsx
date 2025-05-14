
import { TrafficSignsClient } from './TrafficSignsClient';
import rawTrafficSignsData from '@/data/traffic-signs.json'; 
import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import type { TrafficSign } from '@/lib/types';

export const metadata: Metadata = {
  title: `Traffic Signs | ${SITE_NAME}`,
  description: `Learn and understand traffic signs in Nepal on ${SITE_NAME}. Includes mandatory, warning, informative, priority, and prohibitory signs.`,
};

export default async function TrafficSignsPage() {
  // Ensure rawTrafficSignsData has the 'sign' property and it's an array
  const rawSignsArray = rawTrafficSignsData?.sign || [];

  // Map raw data to the TrafficSign type
  const signs: TrafficSign[] = rawSignsArray.map((rawSign: any, index: number) => ({
    id: `ts-${index + 1}`, // Generate a unique ID
    name: rawSign.name, // This is the Nepali name from the new JSON
    image_url: rawSign.selection1, // Use selection1 for image_url
    // description and category are optional and will be undefined if not in rawSign
    description: rawSign.description_np || rawSign.description_en || undefined, // Prioritize Nepali if available, fallback or undefined
    category: rawSign.category_np || rawSign.category_en || undefined, // Prioritize Nepali if available, fallback or undefined
  }));
  
  return <TrafficSignsClient allSigns={signs} />;
}
