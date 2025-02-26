import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";

export const Settings = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch id="email-notifications" />
            <Label htmlFor="email-notifications">Email Notifications</Label>
          </div>
          <div className="flex items-center space-x-4">
            <Switch id="marketing-emails" />
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch id="two-factor" />
            <Label htmlFor="two-factor">Two-factor Authentication</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
