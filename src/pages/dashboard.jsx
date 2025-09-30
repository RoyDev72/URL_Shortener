import React, { useEffect, useState} from 'react';
import { BarLoader } from 'react-spinners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import { UrlState } from '@/context';
import useFetch from '@/hooks/use-fetch';
import { getUrls } from '@/db/apiUrls';
import { getClicksForUrls } from '@/db/apiClicks';
import Error from '@/components/ui/error';
import LinkCard from '@/components/link-card';
import CreateLink from '@/components/create-link';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();

  // Only pass the fetch function to useFetch
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls);
  const { loading: loadingClicks, data: _clicks, fn: fnClicks } = useFetch(getClicksForUrls);

  // Fetch URLs when user.id changes
  useEffect(() => {
    if (user?.id) fnUrls(user.id);
  }, [fnUrls, user?.id]);

  // Filter URLs for search
  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch clicks when urls change
  useEffect(() => {
    if (urls?.length) fnClicks(urls.map((url) => url.id));
  }, [fnClicks, urls]);

  return (
    <div className='flex flex-col gap-8'>
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add content here */}
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add content here */}
            <p>{_clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-between'>
        <h1 className='text-4xl font-extrabold'>My Links</h1>
        <CreateLink />
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute right-3 top-1/2 -translate-y-1/2" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => (
        <LinkCard key={i} url={url} fetchUrls={() => fnUrls(user.id)} />
      ))}
    </div>
  );
};

export default Dashboard;