import Campaign from "@/components/Campaign";
import { useCampaigns } from "@/hooks/useCampaign";

export default function CampaignList() {
  const { data, isLoading, isError, error, isFetching, refetch } = useCampaigns();
  const campaigns = data?.campaigns || [];

  return (
    <div>
      {campaigns.map((campaign) => {
        return <Campaign key={campaign.id} {...campaign} />
      })}

    </div>
  );
}