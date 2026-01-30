import { CreateBlogFormClient } from '@/components/modules/user/createBlog/CreateBlogFormClient';
import CreateBlogFormServer from '@/components/modules/user/createBlog/createBlogFormServer';
import { blogService } from '@/services/blog.service';
import { BlogPost } from '@/types';
import React from 'react';

export default async function CreateBlog () {
    const  {data} = await blogService.getBlogPosts({}, {cache: "no-store"});
    // console.log(data);
    return (
        <div>
            {/* <CreateBlogFormServer /> */}
            <CreateBlogFormClient />
            {
                data?.data?.map((item: BlogPost) =>(
                    <p key={item.id}>{item.title}</p>
                ))
            }
        </div>
    );
};
