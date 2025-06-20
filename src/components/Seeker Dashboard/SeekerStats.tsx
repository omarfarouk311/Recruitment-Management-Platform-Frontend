import { useState, useEffect } from "react";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import SkeletonLoader from "../common/SkeletonLoader";
import axios from "axios";
import config from "../../../config/config";
import { authRefreshToken } from "../../util/authUtils";
import { showErrorToast } from "../../util/errorHandler";

function SeekerStats() {
  type StatKey = "jobsAppliedFor" | "jobOffers" | "assessments" | "interviews";
  let [stats, setStats] = useState<{ key: StatKey; label: string; value: number; icon: any }[]>([
    {
      key: "jobsAppliedFor",
      label: "Pending Jobs Applied For",
      value: 0,
      icon: BriefcaseIcon,
    },
    {
      key: "jobOffers",
      label: "Pending Job Offers",
      value: 0,
      icon: DocumentTextIcon,
    },
    {
      key: "assessments",
      label: "Pending Assessments",
      value: 0,
      icon: ClipboardDocumentCheckIcon,
    },
    {
      key: "interviews",
      label: "Upcoming Interviews",
      value: 0,
      icon: UsersIcon,
    },
  ]);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function loadStats() {
    setIsLoading(true);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/seekers/stats`, { withCredentials: true });
      setStats((prevValue) =>
        prevValue.map((stat) => ({
          ...stat,
          value: res.data[stat.key as StatKey],
        }))
      );
      setTimeout(() => setIsVisible(true), 50);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          const succeeded = await authRefreshToken();
          if (succeeded) await loadStats();
        } else {
          showErrorToast("Error loading stats. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="flex items-center mb-6 mt-6 bg-white min-h-[70px] p-4 rounded-2xl shadow w-[70%] mx-auto">
      <div className="grid grid-flow-col auto-cols-fr justify-evenly w-full gap-4">
        {isLoading ? (
          <div className="max-h-[60px] overflow-y-hidden">
            <SkeletonLoader />
          </div>
        ) : (
          stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center justify-center gap-4 relative">
              <Transition
                as="div"
                show={isVisible}
                enter="transition-opacity duration-[2000ms]"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                className="flex items-center gap-2"
              >
                <stat.icon className="h-8 w-8 text-black-500" />
                <div>
                  <p className="text-lg text-black-500 font-semibold">{stat.label}</p>
                  <p className="text-xl font-semibold text-black-900">{stat.value}</p>
                </div>
              </Transition>

              {/* Vertical line - positioned after the content */}
              {index < stats.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-gray-300 hidden md:block" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SeekerStats;
