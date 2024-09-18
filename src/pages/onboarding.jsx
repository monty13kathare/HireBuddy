import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { HashLoader, ScaleLoader } from 'react-spinners';

const Onboarding = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    const handleRoleSelection = async (role) => {
        await user.update({
            unsafeMetadata: { role }
        }).then(() => {
            navigate(role === "recruiter" ? "/post-job" : "/jobs")
        }).catch((err) => {
            console.error("Error updating role:", err)
        })
    }

    useEffect(() => {
        if (user?.unsafeMetadata?.role) {
            navigate(user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs")
        }
    }, [user])

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
        <div className='flex flex-col items-center justify-center mt-32'>
            <h2 className='font-extrabold text-7xl sm:text-8xl tracking-tighter'>I am a...</h2>
            <div className="grid grid-cols-2 gap-4 w-full md:px-40 mt-16">
                <Button variant="secondary" className="h-36 text-2xl" onClick={() => handleRoleSelection('candidate')}>Candidate</Button>
                <Button variant="destructive" className="h-36 text-2xl" onClick={() => handleRoleSelection('recruiter')}>Recruiter</Button>

            </div>
        </div>
    )
}

export default Onboarding