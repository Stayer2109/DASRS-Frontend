import DataCard from "@/AtomicComponents/molecules/DataCard/DataCard";
import DataChart from "@/AtomicComponents/molecules/DataChart/DataChart";

const StaffOverviewPage = () => {
  const dataCardData = [
    {
      title: "Total Staff",
      value: 20,
      information: "Increase 10% from last month",
    },
    {
      title: "Total Player",
      value: 100,
      information: "Increase 20% from last month",
    },
    {
      title: "Total Coach",
      value: 10,
      information: "Increase 5% from last month",
    },
    {
      title: "Total Referee",
      value: 5,
      information: "Increase 10% from last month",
    },
  ];

  return (
    <div className="staff-overvie-page-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dataCardData.map((dataCard, index) => (
        <DataCard
          key={index}
          title={dataCard.title}
          value={dataCard.value}
          information={dataCard.information}
        />
      ))}

      <DataChart />
    </div>
  );
};

export default StaffOverviewPage;
