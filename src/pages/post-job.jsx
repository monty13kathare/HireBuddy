import { getCompanies } from '@/api/apiCompanies'
import { addNewJob } from '@/api/apiJobs'
import AddCompanyDrawer from '@/components/add-company-drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import { zodResolver } from '@hookform/resolvers/zod'
import MDEditor from '@uiw/react-md-editor'
import { State } from 'country-state-city'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { BarLoader, ScaleLoader } from 'react-spinners'
import { z } from 'zod'

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    location: z.string().min(1, { message: "Select a location" }),
    company_id: z.string().min(1, { message: "Select or add new Company" }),
    requirements: z.string().min(1, { message: "Requirements is required" }),
    job_type: z.string().min(1, { message: "Job type is required" }),
    job_opening: z.string().min(1, { message: "Job opening is required" }),
    skills: z.string().min(1, { message: "Skills is required" }),
    package: z.string().min(1, { message: "Package is required" }),


})

const PostJob = () => {
    const navigate = useNavigate();
    const { isLoaded, user } = useUser();
    const [location, setLocation] = useState("");
    const { fn: fnCompanies, data: companies, loading: loadingCompanies } = useFetch(getCompanies);


    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            location: "",
            company_id: "",
            requirements: ""
        }, resolver: zodResolver(schema)
    })

    useEffect(() => {
        if (isLoaded) {
            fnCompanies();
        }
    }, [isLoaded]);

    const {
        loading: loadingCreateJob,
        error: errorCreateJob,
        data: dataCreateJob,
        fn: fnCreateJob,
    } = useFetch(addNewJob);

    const onSubmit = (data) => {
        fnCreateJob({
            ...data,
            recruiter_id: user.id,
            isOpen: true,
        });
    }

    useEffect(() => {
        if (dataCreateJob?.length > 0) {
            navigate("/jobs")
        }
    }, [loadingCreateJob])

    if (!isLoaded || loadingCompanies) {
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

    if (user?.unsafeMetadata?.role !== "recruiter") {
        return <Navigate to="/jobs" />
    }

    return (
        <div>
            <h1 className='font-extrabold text-6xl sm:text-7xl text-center pb-8'><span className='text-indigo-700'>Post </span> a Job</h1>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 pb-0'>
                <Input
                    type="text"
                    placeholder="Job Title"
                    {...register("title")}
                />
                {errors.title && (<p className='text-red-500'>{errors.title.message}</p>)}

                <Textarea placeholder="Job Description"  {...register("description")} />
                {errors.description && (<p className='text-red-500'>{errors.description.message}</p>)}

                <div className='flex gap-4 items-center'>
                    <Controller
                        name='location'
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value} onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {State.getStatesOfCountry("IN")?.map(({ name }) => {
                                            return (
                                                <SelectItem key={name} value={name}>{name}</SelectItem>
                                            );
                                        })}

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <Controller
                        name='company_id'
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value} onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Company" >
                                        {
                                            field.value ? companies?.find((com) => com.id === Number(field.value))?.name : "Company"
                                        }
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies?.map(({ name, id }) => {
                                            return (
                                                <SelectItem key={name} value={id}>{name}</SelectItem>
                                            );
                                        })}

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />


                    <AddCompanyDrawer fetchCompanies={fnCompanies} />
                </div>
                {errors.location && (<p className='text-red-500'>{errors.location.message}</p>)}
                {errors.company_id && (<p className='text-red-500'>{errors.company_id.message}</p>)}


                <div className='flex gap-4 items-center'>
                    <Input
                        type="text"
                        placeholder="Skills (Comma Separated)"
                        {...register("skills")}
                    />
                    <Input
                        type="text"
                        placeholder="Number of opening"
                        {...register("job_opening")}
                    />
                    <Input
                        type="text"
                        placeholder="Job Package"
                        {...register("package")}
                    />
                    <Controller
                        name='job_type'
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="Temporary">Temporary</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                {errors.skills && (<p className='text-red-500'>{errors.skills.message}</p>)}
                {errors.job_opening && (<p className='text-red-500'>{errors.job_opening.message}</p>)}
                {errors.package && (<p className='text-red-500'>{errors.package.message}</p>)}
                {errors.job_type && (<p className='text-red-500'>{errors.job_type.message}</p>)}


                <p className='text-gray-500'>Job Requirements</p>
                <Controller
                    name='requirements'
                    control={control}
                    render={({ field }) => (
                        <MDEditor value={field.value} onChange={field.onChange} />
                    )}
                />
                {errors.requirements && (<p className='text-red-500'>{errors.requirements.message}</p>)}

                {errorCreateJob && (<p className='text-red-500'>{errorCreateJob.message}</p>)}

                {loadingCreateJob && (<BarLoader color="#12f4b7" className='mt-4' width={"100%"} />)}

                <Button type="submit" variant="indigo" size="lg" className="mt-2">Submit</Button>
            </form>
        </div>
    )
}

export default PostJob