import { getSavedJobs } from '@/api/apiJobs';
import JobCard from '@/components/job-card';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader, ScaleLoader } from 'react-spinners';

const SavedJobs = () => {
    const { isLoaded } = useUser();
    const { fn: fnSavedJobs, data: savedjobs, loading: loadingSavedJobs } = useFetch(getSavedJobs);

    useEffect(() => {
        if (isLoaded) {
            fnSavedJobs();
        }
    }, [isLoaded])

    if (!isLoaded || loadingSavedJobs) {
        return <BarLoader color="#12f4b7" className='mt-4' width={"100%"} />
    }

    return (
        <div>
            <h1 className='font-extrabold text-6xl sm:text-7xl text-center pb-8'><span className='text-indigo-700'>Saved </span> Jobs </h1>

            {loadingSavedJobs === false && (
                <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        savedjobs?.length ? (
                            savedjobs?.map((saved) => {
                                return (<JobCard key={saved.id} job={saved?.job} savedInit={true} onJabSaved={fnSavedJobs} />)
                            })
                        ) : (
                            <div className=''>No Saved Jobs Found 👀</div>
                        )
                    }
                </div>
            )}
        </div>

    )
}

export default SavedJobs