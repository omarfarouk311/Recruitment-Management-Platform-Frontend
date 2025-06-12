import UserNav from "../components/Header/UserNav";
import ProfileHeader from "../components/Profile/sections/RecruiterProfileHeader";
import RecruiterInfo from "../components/Profile/sections/RecruiterInfo";
import useStore from "../stores/globalStore";
import { useEffect, useState } from "react";

function RecruiterProfile() {
    const fetchRecruiterCompanyInfo = useStore.useRecruiterProfileFetchInfo();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchRecruiterCompanyInfo();
            setIsLoading(false);
        };

        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <UserNav />
            <div className="p-8 flex flex-col items-center">
                <div className="w-full max-w-3xl mb-16 mt-4">
                    <ProfileHeader isLoading={isLoading} />
                </div>
                <div className="w-full max-w-3xl">
                    <RecruiterInfo isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

export default RecruiterProfile;
