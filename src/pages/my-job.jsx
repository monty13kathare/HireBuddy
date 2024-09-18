import CreatedApplications from '@/components/created-applications';
import CreatedJobs from '@/components/created-jobs';
import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { BarLoader } from 'react-spinners';

const MyJobs = () => {
    const { isLoaded, user } = useUser();

    if (!isLoaded) {
        return <BarLoader color="#12f4b7" className='mt-4' width={"100%"} />
    }

    return (
        <div>
            <h1 className='font-extrabold text-6xl sm:text-7xl text-center pb-8'>
                <span className='text-indigo-700'>My </span>  {user?.unsafeMetadata?.role === "candidate" ? "Applications" : "Jobs"}
            </h1>

            {user?.unsafeMetadata?.role === "candidate" ? (
                <CreatedApplications />
            ) : (
                <CreatedJobs />
            )}
        </div>
    )
}

export default MyJobs