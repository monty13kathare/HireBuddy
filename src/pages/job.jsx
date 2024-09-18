import { getSingleJob, updateHiringStatus } from '@/api/apiJobs';
import ApplicationCard from '@/components/application-card';
import ApplyJobDrawer from '@/components/apply-job';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BarLoader, ScaleLoader } from 'react-spinners';

const JobPage = () => {
    const { isLoaded, user } = useUser();
    const { id } = useParams();
    const { fn: fnJob, data: job, loading: loadingJob } = useFetch(getSingleJob, { job_id: id });
    const { fn: fnHiringStatus, loading: loadingHiringStatus } = useFetch(updateHiringStatus, { job_id: id });


    const handleStatusChange = (value) => {
        const isOpen = value === "open";
        fnHiringStatus(isOpen).then(() => fnJob());
    }

    useEffect(() => {
        if (isLoaded) fnJob();
    }, [isLoaded])

    if (!isLoaded || loadingJob) {
        return <div className='fixed inset-0 w-full h-screen flex justify-center items-center'>
            <ScaleLoader
                color="rgba(74, 211, 163, 1)"
                height={40}
                margin={2}
                radius={2}
                speedMultiplier={1}
                width={4}
            />
        </div>
    }



    return (
        <div className='flex flex-col lg:gap-8 gap-6'>
            <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
                <h1 className='font-extrabold pb-3 text-3xl md:text-4xl lg:text-6xl'>
                    {job?.title}
                </h1>
                <img src={job?.company?.logo_url} alt={job?.title} className='h-12' />
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                    <MapPinIcon />
                    {job?.location}
                </div>
                <div className="flex gap-2">
                    <Briefcase />
                    Job Type : {job?.job_type}
                </div>
                <div className="flex gap-2">
                    <Briefcase />
                    {job?.applications?.length} Applicants
                </div>
                <div className="flex gap-2">
                    {job?.isOpen ? (
                        <><DoorOpen /> Open</>
                    ) : (
                        <><DoorClosed /> Closed</>
                    )}
                </div>
            </div>

            {/* hiring status */}
            {loadingHiringStatus && (
                <BarLoader color="#12f4b7" className='mt-4' width={"100%"} />
            )}
            {
                job?.recruiter_id === user?.id && (
                    <Select onValueChange={handleStatusChange}>
                        <SelectTrigger className={`w-full font-medium ${job?.isOpen ? "bg-green-500 text-gray-900" : "bg-red-500 text-gray-900"}`}>
                            <SelectValue placeholder={"Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                )
            }

            <h2 className='text-2xl sm:text-3xl font-bold'>About the Job</h2>
            <p className='sm:text-lg'>{job?.description}</p>
            <h2 className='text-2xl sm:text-3xl font-bold'>What we are looking for</h2>
            <MDEditor.Markdown
                source={job?.requirements}
                className='bg-transparent sm:text-lg text-secondary-foreground'
            />

            <h2 className='text-2xl sm:text-3xl font-bold'>Skill(s) required</h2>
            <div className='flex flex-wrap gap-4'>
                {job?.skills
                    ?.split(',') // Split the string into an array
                    ?.map((skill, index) => (
                        <p key={index} className='sm:text-lg py-2 px-6 bg-gray-200 text-gray-900 rounded-full'>
                            {skill.trim()} {/* Trim any extra whitespace */}
                        </p>
                    ))}
            </div>

            <h2 className='text-2xl sm:text-3xl font-bold'>Salary or Package</h2>
            <p className='sm:text-lg'>Annual CTC :  {job?.package} /year</p>
            <h2 className='text-2xl sm:text-3xl font-bold'>Number of openings</h2>
            <p className='sm:text-lg'>{job?.job_opening || 1}</p>



            {job?.recruiter_id !== user?.id && (
                <ApplyJobDrawer
                    job={job}
                    user={user}
                    fetchJob={fnJob}
                    applied={job?.applications.find((ap) => ap.candidate_id === user.id)}
                />
            )}

            {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
                <div className='flex flex-col gap-4' >
                    <h2 className='text-2xl sm:text-3xl font-bold'>Applications</h2>
                    {job?.applications?.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default JobPage