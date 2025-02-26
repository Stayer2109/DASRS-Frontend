import {
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AdminHeader = ({ activeTab }) => {
  const getBreadcrumbs = () => {
    // Handle tournament section breadcrumbs
    if (["tournament", "rounds", "matches"].includes(activeTab)) {
      return (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Tournament</span>
          {activeTab !== "tournament" && (
            <>
              <span className="mx-2">›</span>
              <span className="text-gray-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </>
          )}
        </div>
      );
    }

    // Default breadcrumbs for other sections
    return (
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>Home</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </span>
      </div>
    );
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-8 py-4">
        {getBreadcrumbs()}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>

          {/* Quick Actions */}
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <Button variant="ghost" size="icon">
                <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
