import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import companies from "../data/companies.json"
import faqs from "../data/faq.json"
import Autoplay from 'embla-carousel-autoplay'
import banner from "../../public/companies/banner2.jpg"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import useFetch from '@/hooks/use-fetch'
import { getCompanies } from '@/api/apiCompanies'
import { useUser } from '@clerk/clerk-react'
import { getJobs } from '@/api/apiJobs'
import JobCard from '@/components/job-card'
import { ScaleLoader } from 'react-spinners'

const Landing = () => {
    const { isLoaded, user } = useUser();
    const { fn: fnCompanies, data: companies, loading: loadingCompanies } = useFetch(getCompanies);
    const { fn: fnJobs, data: jobs, loading: loadingJobs } = useFetch(getJobs);

    console.log('companies', companies)
    console.log('jobs', jobs)


    useEffect(() => {
        if (isLoaded) {
            fnCompanies();
        }
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            fnJobs();
        }
    }, [isLoaded]);


    if (!isLoaded) {
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
        <main className='w-full flex flex-col gap-6 lg:gap-10 '>
            <section className='flex flex-col items-center justify-center text-center gap-6'>
                <h1 className=' items-center text-3xl font-extrabold sm:text-5xl lg:text-6xl'>Find Your Dream <span className='text-indigo-700'>Job </span> and get <span className='text-indigo-700'>  Hired</span> ..🎯</h1>
                <p className='text-gray-500 sm:mt-4 text-xs sm:text-xl'>Explore thousands of job listings or find the perfect candidate</p>
            </section>
            <div className='flex items-center justify-center gap-6'>
                <Link to="/jobs">
                    <Button variant="blue" size="lg">Find a Job</Button>
                </Link>
                <Link to="/post-job">
                    <Button variant="indigo" size="lg">Post a Job</Button>
                </Link>
            </div>

            <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10" >
                <CarouselContent className="flex gap-5 sm:gap-20 items-center">
                    {
                        companies?.map(({ name, id, logo_url }) => {
                            return (
                                <CarouselItem key={id} className="basis-1/3  lg:basis-1/6 bg-slate-500 bg-opacity-20 rounded-md">
                                    <img src={logo_url} alt={name} className='h-10 my-2 lg:my-4 w-auto  sm:h-14 ' />
                                </CarouselItem>
                            );
                        })
                    }
                </CarouselContent>
            </Carousel>


            {/* recent jobs */}
            {
                user && <div className='w-full flex flex-col gap-4'>
                    <h1 className='text-3xl sm:text-3xl font-bold lg:text-4xl'>Recent Jobs</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {
                            jobs && [...jobs]?.reverse()?.slice(0, 6).map((job) => {
                                return <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
                            })
                        }

                    </div>
                    <Link to="/jobs" className='text-center'>
                        <Button variant="blue" size="lg">VIew All Jobs</Button>
                    </Link>
                </div>
            }



            {/* Banner */}
            <img src={banner} alt="banner" className='w-full rounded' />


            <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>For Job Seekers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Search and apply for jobs, track applications, and more.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>For Employers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Post jobs, manage applications, and find the best candidates.
                    </CardContent>
                </Card>
            </section>

            <Accordion type="single" collapsible >
                {
                    faqs.map((faq, index) => {
                        return (
                            <AccordionItem value={`item-${index + 1}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })
                }
            </Accordion>


        </main>
    )
}

export default Landing