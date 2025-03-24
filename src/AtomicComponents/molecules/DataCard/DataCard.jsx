import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";

import PropTypes from "prop-types";

const DataCard = ({ title, value, information }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{information}</p>
      </CardContent>
    </Card>
  );
};

DataCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  information: PropTypes.string,
};

export default DataCard;
