import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { BriefcaseBusiness, Heart, Moon, PenBox, Sun } from 'lucide-react'
import { Switch } from './ui/switch'

const Header = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const [search, setSearch] = useSearchParams();
    const { user } = useUser();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const savedTheme = localStorage.getItem('theme') || 'light';

    useEffect(() => {
        if (search.get("sign-in")) {
            setShowSignIn(true);
        }
    }, [search]);

    useEffect(() => {
        if (savedTheme === "dark") {
            setIsDarkMode(true)
        } else {
            setIsDarkMode(false)
        }
    }, [savedTheme])


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            setSearch({});
        }
    }

    const handleThemeChange = () => {
        setIsDarkMode(!isDarkMode);

        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };



    return (
        <>
            <nav className='w-full lg:py-6 py-4 lg:px-10 px-6 flex justify-between items-center border-b'>
                <Link to="/" className='flex gap-2 items-center'>
                    <h1 className='lg:text-5xl md:text-3xl text-2xl text-center font-extrabold'><span className='text-indigo-700'>Hire</span>Buddy</h1>
                </Link>
                <div className="flex gap-8">

                    <div className="flex items-center gap-2">
                        <Sun />
                        <Switch checked={isDarkMode} onCheckedChange={handleThemeChange} />
                        <Moon />
                    </div>
                    <SignedOut>
                        <Button variant="outline" onClick={() => setShowSignIn(true)}>Login</Button>
                    </SignedOut>
                    <SignedIn>
                        {
                            user?.unsafeMetadata?.role === "recruiter" && (
                                <Link to="/post-job">
                                    <Button variant="indigo" className="rounded-full">
                                        <PenBox size={20} className='mr-2' />
                                        Post a Job
                                    </Button>
                                </Link>
                            )
                        }

                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10"
                                },
                            }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label={user?.unsafeMetadata?.role === "recruiter" ? "My Jobs" : "My Applications"}
                                    labelIcon={<BriefcaseBusiness size={15} />}
                                    href='/my-jobs'
                                />
                                <UserButton.Link
                                    label='Saved Jobs'
                                    labelIcon={<Heart size={15} />}
                                    href='/saved-jobs'
                                />
                            </UserButton.MenuItems>

                        </UserButton>
                    </SignedIn>
                </div>
            </nav>

            {
                showSignIn && (
                    <div className='fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50' onClick={handleOverlayClick}>
                        <SignIn
                            signUpForceRedirectUrl='/onboarding'
                            fallbackRedirectUrl='/onboarding'
                        />
                    </div>
                )
            }
        </>
    )
}

export default Header