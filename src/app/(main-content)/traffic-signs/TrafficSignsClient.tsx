
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TrafficSign } from '@/lib/types';
import { Tag, TrafficCone as TrafficConeIconLucide } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface TrafficSignsClientProps {
  allSigns: TrafficSign[];
}

type SignCategoryFilter = string; 


export function TrafficSignsClient({ allSigns }: TrafficSignsClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<SignCategoryFilter>('All');

  

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    allSigns.forEach(sign => {
      if (sign.category) { // Only add if category exists
        categories.add(sign.category);
      }
    });
    return ['All', ...Array.from(categories)];
  }, [allSigns]);


  const filteredSigns = useMemo(() => {
    return allSigns.filter(sign => {
      const category = sign.category; // Can be undefined
      const matchesCategory = categoryFilter === 'All' || (category && category === categoryFilter);
      return matchesCategory;
    });
  }, [allSigns, categoryFilter]);



  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Traffic Signs</h1>
      <p className="text-muted-foreground text-center mb-8">Learn and understand the various traffic signs in Nepal.</p>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-end">
        {uniqueCategories.length > 1 && ( // Only show filter if there are actual categories beyond "All"
            <Select value={categoryFilter} onValueChange={(value: SignCategoryFilter) => setCategoryFilter(value)}>
            <SelectTrigger className="w-full sm:w-[280px]">
                <Tag className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Sign Categories</SelectLabel>
                {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                    </SelectItem>
                ))}
                </SelectGroup>
            </SelectContent>
            </Select>
        )}
      </div>

      {filteredSigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSigns.map((sign) => (
            <Card key={sign.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] relative w-full bg-muted">
                  <Image
                    src={sign.image_url}
                    alt={sign.name} // Alt text will be Nepali name
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain p-4"
                    data-ai-hint="traffic sign illustration"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col">
                <CardTitle className="text-lg font-semibold mb-1">{sign.name}</CardTitle>
                {sign.description && (
                    <CardDescription className="text-sm text-muted-foreground flex-grow">
                        {sign.description}
                    </CardDescription>
                )}
                {sign.category && (
                    <p className="mt-3 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full self-start">
                    {sign.category}
                    </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrafficConeIconLucide className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold">No Traffic Signs Found</p>
          <p className="text-muted-foreground">Try adjusting your filter criteria.</p>
        </div>
      )}
    </div>
  );
}

