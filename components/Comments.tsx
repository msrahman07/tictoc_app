import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import useAuthStore from '../store/authStore';
import NoResults from './NoResults';
import { allUsersQuery } from '../utils/queries';

interface IProps {
  isPostingComment: boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: IComment[];
}

interface IComment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref: string; _id: string; }
}

const Comments = ({ comment, setComment, addComment, isPostingComment, comments }: IProps) => {
  const { userProfile, allUsers }: { userProfile: any, allUsers: any[] } = useAuthStore();

  return (
    <div className='border-t-2 border-gray-200 pt-4 px-10 bg-[#f8f8f8] border-b-2 lg:pb-0 pb-[100px]'>
      <div className='overflow-scroll lg:h-[475px]'>
        {comments?.length ? (
          <div>
            {comments.map((item: IComment) => (
              <>
                {allUsers.map((user) => (
                  user._id === (item.postedBy?._id || item.postedBy?._ref) && (
                    <div className='lg:flex-row p-2 items-center' key={item._key}>
                      <Link href={`/profile/${user._id}`}>
                        <div className="flex items-start gap-3">
                          <div className='w-8 h-8'>
                            <Image
                              src={user.image}
                              width={34}
                              height={34}
                              className="rounded-full"
                              alt="user profile"
                              layout="responsive"
                            />
                          </div>
                          <div className='hidden xl:block'>
                            <p className="flex gap-1 items-center text-md font-boldtext-primary lowercase">{user.userName.replaceAll(" ", "")} <GoVerified className='text-blue-400' /></p>
                            <p className="capitalize text-gray-400 text-xs">{user.userName}</p>
                          </div>
                        </div>
                      </Link>
                      <div>
                        <p className='text-md ml-2'>{item.comment}</p>
                      </div>
                    </div>
                  )
                ))}
              </>
            ))}
          </div>
        ) : (
          <div>
            <NoResults text='No comments yet' />
          </div>
        )}
      </div>
      {userProfile && (
        <div className='absolute bottom-0 left-0 pb-6 px-2 md:px-10'>
          <form onSubmit={addComment} className="flex gap-4">
            <input
              value={comment}
              type="text"
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add comment"
              className="bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
            />
            <button className='text-md text-gray-400 ' onClick={addComment}>
              {isPostingComment ? (
                'Commenting...'
              ) : (
                'Comment'
              )
              }
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Comments