import { Link } from "react-router-dom";
import FPTSponsorLogo from "../../assets/img/fpt-logo.png";
import Logo from "../../assets/icon/dasrs-logo.png";
import RacingThunder from "../../assets/img/racing-thunder.jpg";

const Footer = () => {
  const infoLinks = [
    {
      title: "Race Calendar",
      links: [{ text: "Overview", path: "#" }],
    },
    {
      title: "Results",
      links: [
        { text: "Race Results", path: "#" },
        { text: "Standing", path: "#" },
        { text: "Jeddah Race Report S2", path: "#" },
        { text: "Doha Race Report S2", path: "#" },
        { text: "Season 1 Results", path: "#" },
      ],
    },
    {
      title: "News & Media",
      links: [
        { text: "Latest News & Media", path: "#" },
        { text: "All News", path: "#" },
        { text: "All Media", path: "#" },
        { text: "Inside E1 Docuseries", path: "#" },
      ],
    },
    {
      title: "Team & Pilots",
      links: [{ text: "Team & Pilots", path: "#" }],
    },
  ];

  const footerLinks = ["Contact", "FAQs", "Media", "Partners"];
  const navHoverStyle = "hover:text-lime-300 transition-colors duration-200";

  return (
    <footer className="bg-blue-950 mt-20 px-4 sm:px-10 py-10 sm:py-14 w-full text-white">
      {/* Sponsor */}
      <div className="flex justify-center mb-10">
        <img
          src={FPTSponsorLogo}
          alt="FPT Sponsor Logo"
          className="bg-white shadow-md p-2 rounded-lg w-[70%] sm:w-[320px]"
        />
      </div>

      {/* Divider */}
      <div className="bg-blue-600 mb-10 h-[1px]" />

      {/* Info Section */}
      <div className="flex sm:flex-row flex-col justify-between gap-10 sm:gap-20">
        {/* Left: Info Grid */}
        <div className="gap-10 grid grid-cols-2 sm:grid-cols-4">
          {infoLinks.map(({ title, links }) => (
            <div key={title}>
              <h3 className="mb-4 font-bold text-lime-400 text-xl">{title}</h3>
              <ul className="space-y-2 text-sm">
                {links.map(({ text, path }) => (
                  <li key={text}>
                    <Link to={path} className={navHoverStyle}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right: Image + Text */}
        <div className="flex flex-col items-center sm:items-start max-w-sm">
          <img
            src={RacingThunder}
            alt="Racing Thunder"
            className="shadow-lg mb-4 rounded-xl w-full h-auto object-cover"
          />
          <p className="text-base sm:text-lg sm:text-left text-center leading-relaxed">
            <strong className="text-lime-400">Dive into exclusive insights</strong> and unparalleled racing experiences.
          </p>
        </div>
      </div>

      {/* Extra Links */}
      <div className="flex justify-center mt-10">
        <ul className="flex flex-wrap justify-center gap-6 text-sm">
          {footerLinks.map((text, i) => (
            <li key={i}>
              <Link to="#" className={navHoverStyle}>
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="bg-blue-700 my-8 h-[1px]" />

      {/* Logo & Copyright */}
      <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={Logo}
            alt="DASRS Logo"
            className="bg-blue-500 shadow-md p-1.5 rounded-full w-16 h-16"
          />
          <span className="text-gray-300 text-sm">
            © 2025 DASRS — All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
