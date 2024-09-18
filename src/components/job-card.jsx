import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { deleteJob, saveJob } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { BarLoader } from 'react-spinners';

const JobCard = ({
    job,
    isMyJob = false,
    savedInit = false,
    onJabSaved = () => { },
}) => {
    const [saved, setSaved] = useState(savedInit);
    const { user } = useUser();
    const { fn: fnSavedJob, data: savedJob, loading: loadingSavedJob } = useFetch(saveJob, { alreadySaved: saved });
    const { fn: fnDeleteJob, loading: loadingDeleteJob } = useFetch(deleteJob, { job_id: job.id });


    const handleSaveJob = async () => {
        await fnSavedJob({
            user_id: user.id,
            job_id: job.id,
        });
        onJabSaved();
    };

    const handleDeleteJob = async () => {
        await fnDeleteJob();
        onJabSaved();
    }

    useEffect(() => {
        if (savedJob !== undefined) {
            setSaved(savedJob?.length > 0)
        }
    }, [savedJob])


    return (
        <Card className="flex flex-col bg-gray-800 bg-opacity-15">
            {
                loadingDeleteJob && (
                    <BarLoader color="#12f4b7" className='mt-4' width={"100%"} />
                )
            }
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    {job.title}
                    {isMyJob && (
                        <Trash2Icon fill='red' size={18} className='text-red-300 cursor-pointer' onClick={handleDeleteJob} />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
                <div className='flex justify-between'>
                    {job.company && <img src={job.company.logo_url} className='h-6' />}
                    <div className='flex items-center gap-2'>
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
                <hr />
                {job.description.substring(0, job.description.indexOf("."))}
            </CardContent>
            <CardFooter className="flex gap-2">
                <Link to={`/job/${job.id}`} className='flex-1'>
                    <Button variant="secondary" className="w-full">More Details</Button>
                </Link>

                {
                    !isMyJob && (
                        <Button
                            variant="outline"
                            className="w-15"
                            onClick={handleSaveJob}
                            disabled={loadingSavedJob}
                        >
                            {saved ? (
                                <Heart size={20} stroke='red' fill='red' />
                            ) : (
                                <Heart size={20} />
                            )}
                        </Button>
                    )
                }

            </CardFooter>
        </Card>
    )
}

export default JobCard