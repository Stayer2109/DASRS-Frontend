import { LoginIcon, LogoutIcon } from "@/assets/icon-svg";
import CircularButton from "@/AtomicComponents/atoms/CircularButton/CircularButton";
import Auth from "@/AtomicComponents/organisms/Auth/Auth";
import Footer from "@/AtomicComponents/organisms/Footer";
import Header from "@/AtomicComponents/organisms/Header/Header";
import CurrentRaces from "@/AtomicComponents/organisms/HomePage/CurrentRaces/CurrentRaces";
import RaceCalendar from "@/AtomicComponents/organisms/HomePage/RaceCalendar";
import Leaderboard from "@/AtomicComponents/pages/Organizer/Leaderboard/Leaderboard";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";

const HomepageTemplate = () => {
  const { auth } = useAuth();
  const logout = useLogout();

  return (
    <>
      <Header />

      <main className="space-y-20 sm:space-y-28 bg-gradient-to-br mt-[80px] px-4 sm:px-10 py-10 min-h-screen transition-all duration-300">
        {/* Hero/Slider */}
        <section>
          <h2 className="mb-6 font-bold text-blue-800 text-2xl sm:text-4xl text-center">
            🔥 Featured Races
          </h2>
          <CurrentRaces />
        </section>

        {/* Race Calendar Section */}
        <section>
          <h2 className="mb-6 font-bold text-blue-800 text-2xl sm:text-4xl text-center">
            🏁 Race Calendar
          </h2>
          <RaceCalendar />
        </section>

        {/* Leaderboard Section */}
        <section>
          <h2 className="mb-6 font-bold text-blue-800 text-2xl sm:text-4xl text-center">
            🏆 Leaderboards
          </h2>
          <Leaderboard forLandingPage />
        </section>
      </main>

      {/* Logout Button or Auth Modal */}
      {auth?.accessToken ? (
        <div className="px-4 sm:px-10 py-4">
          <CircularButton
            content="Logout"
            className="right-5 bottom-5 z-50 fixed"
            icon={<LogoutIcon color="#000" height={"30px"} />}
            onClick={logout}
          />
        </div>
      ) : (
        <Auth />
      )}

      <Footer />
    </>
  );
};

export default HomepageTemplate;
