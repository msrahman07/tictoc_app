import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';
import { Video } from '../../types';
import { BASE_URL } from '../../utils';
import useAuthStore from '../../store/authStore';
import LikeButton from '../../components/LikeButton';
import Comments from '../../components/Comments';

interface IProps {
    postDetails: Video,
}

const Detail = ({ postDetails }: IProps) => {
    const [post, setPost] = useState(postDetails);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setisVideoMuted] = useState(false);
    const router = useRouter();
    const { userProfile } : {userProfile:any} = useAuthStore();
    const [comment, setComment] = useState('')
    const [isPostingComment, setIsPostingComment] = useState(false);

    const onVideoClick = () => {
        if (playing) {
            videoRef?.current?.pause();
            setPlaying(false);
        } else {
            videoRef?.current?.play();
            setPlaying(true);
        }
    };



    if (!post) return null;
    
    const handleLike = async (like: boolean) => {
        if(userProfile){
            const { data } = await axios.put(`${BASE_URL}/api/like`, {
               userId: userProfile._id,
               postId: post._id,
               like: like
            })
            setPost({...post, likes: data.likes})
        }
    };

    const addComment = async (e:any) => {
        e.preventDefault();
        console.log("Add comment func working: userProfile before validation");

        if(userProfile && comment){
            setIsPostingComment(true);
            console.log("Add comment func working after validation: userProfile", userProfile._id, ", comment",comment);

            const {data} = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
                userId: userProfile._id,
                comment
            });
            console.log(data);
            setPost({ ...post, comments:data.comments });
            setComment("");
            setIsPostingComment(false);
        }
    }

    return (
        <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
            <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black'>
                <div className='opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
                    <p className='cursor-pointer' onClick={() => router.back()}>
                        <MdOutlineCancel className='text-white text-[35px] hover:opacity-90' />
                    </p>
                </div>
                <div className='relative'>
                    <div className='lg:h-[100vh] h-[60vh]'>
                        <video
                            ref={videoRef}
                            muted={isVideoMuted}
                            loop
                            onClick={onVideoClick}
                            src={post.video.asset.url}
                            className='h-full cursor-pointer'
                        />
                    </div>
                    <div className='absolute top-[45%] left-[45%]'>
                        {!playing &&
                            <button onClick={onVideoClick} >
                                <BsFillPlayFill className='text-white text-6xl lg:text-8xl' />
                            </button>
                        }
                    </div>
                </div>
                <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
                    {isVideoMuted ? (
                        <button onClick={() => setisVideoMuted(false)}>
                            <HiVolumeOff className='text-white text-2xl lg:text-4xl' />
                        </button>
                    ) : (
                        <button onClick={() => setisVideoMuted(true)}>
                            <HiVolumeUp className='text-white text-2xl lg:text-4xl' />
                        </button>
                    )}
                </div>
            </div>
            <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
                <div className='lg:mt-20 mt-10'>
                    <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
                        <div className='-4 mlmd:w-20 md:h-20 w-16 h-16'>
                            <Link href="/">
                                <>
                                    <Image
                                        width={62}
                                        height={62}
                                        className="rounded-full"
                                        src={post.postedBy.image}
                                        alt="profile photo"
                                        layout='responsive'
                                    />
                                </>
                            </Link>
                        </div>
                        <div>
                            <Link href="/">
                                <div className='mt-3 flex flex-col gap-2'>
                                    <p className='flex gap-2 iterms-center md:text-md font-bold text-primary'>{post.postedBy.userName} {` `}
                                        <GoVerified className='text-blue-400 text-md' />
                                    </p>
                                    <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>{post.postedBy.userName} </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <p className='px-10 text-lg text-gray-600'>{post.caption}</p>
                        <div className='mt-10 px-10'>
                            {userProfile && 
                                <LikeButton 
                                    likes = {post.likes}
                                    handleLike = {() => handleLike(true)}
                                    handleDislike = {() => handleLike(false)}
                                />
                            }
                        </div>
                        <Comments 
                            comment={comment}
                            setComment={setComment}
                            addComment={addComment}
                            comments={postDetails.comments}
                            isPostingComment={isPostingComment}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({ params: { id } }: { params: { id: string } }) => {
    const { data } = await axios.get(`${BASE_URL}/api/post/${id}`)
    return {
        props: { postDetails: data },
    }
}

export default Detail