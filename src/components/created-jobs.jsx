import { getMyJobs } from '@/api/apiJobs';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './job-card';
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/use-fetch';

const CreatedJobs = () => {
    const { user } = useUser();
    const { fn: fnCreatedJobs, data: createdJobs, loading: loadingCreatedJobs } = useFetch(getMyJobs, { recruiter_id: user.id });

    useEffect(() => {
        fnCreatedJobs();
    }, []);


    if (loadingCreatedJobs) {
        return <BarLoader color="#12f4b7" className='mt-4' width={"100%"} />
    }


    return (
        <div>
            <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {
                    createdJobs?.length ? (
                        createdJobs?.map((job) => {
                            return <JobCard key={job.id} job={job} onJobSaved={fnCreatedJobs} isMyJob />
                        })
                    ) : (
                        <div>No Jobs Found 🥲</div>
                    )
                }
            </div>
        </div>
    )
}

export default CreatedJobs