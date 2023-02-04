/* eslint-disable no-undef */
import { get, post, put, deleteIt, truncate, patch } from "./helper.js";
import dotenv from "dotenv";

describe("Axe API", () => {
  beforeAll(async () => {
    dotenv.config();
    await truncate("posts");
    return await truncate("users");
  });

  afterAll(async () => {
    await truncate("posts");
    return await truncate("users");
  });

  test("should not be able to create a new post without data", async () => {
    const data = {};
    await post({
      url: "/api/v1/users/1/posts",
      data,
      status: 400,
    });
  });

  test("should be able to create a new user", async () => {
    let data = {
      email: "foo@bar.com",
      name: "John",
      surname: "Doe",
    };
    const { body: user } = await post({
      url: "/api/v1/users",
      data,
      status: 200,
    });
    const userId = user.id;
    expect(user.email).toBe("foo@bar.com");
    expect(user.created_at).not.toBeNull();
    expect(user.fullname).toBe("John Doe");

    const { body: userPaginate } = await get({
      url: "/api/v1/users?with=posts",
      status: 200,
    });
    expect(userPaginate.data.length).toBe(1);
    expect(userPaginate.data[0].posts.length).toBe(0);

    const { body: createdPost } = await post({
      url: `/api/v1/users/${userId}/posts`,
      data: {
        title: "My Post",
        content: "This is the best post ever",
      },
      status: 200,
    });
    const postId = createdPost.id;
    expect(createdPost.title).toBe("My Post");
    expect(createdPost.user_id).toBe(userId);

    const { body: emptyUserPaginate } = await get({
      url: "/api/v1/users?with=posts",
      status: 200,
    });
    expect(emptyUserPaginate.data.length).toBe(1);
    expect(emptyUserPaginate.data[0].posts.length).toBe(1);
    expect(emptyUserPaginate.data[0].posts[0].title).toBe("My Post");

    const { body: postPaginate } = await get({
      url: `/api/v1/users/${userId}/posts?with=user{name|surname|password_salt}`,
      status: 200,
    });
    expect(postPaginate.data.length).toBe(1);
    expect(postPaginate.data[0].title).toBe("My Post");
    expect(postPaginate.data[0].user.fullname).toBe("John Doe");
    expect(postPaginate.data[0].user.created_at).toBeUndefined();
    expect(postPaginate.data[0].user.password_salt).toBe(undefined);

    const { body: updatedPost } = await put({
      url: `/api/v1/users/${userId}/posts/${postId}`,
      data: {
        title: "My Post Title",
        content: "This is the best post ever",
      },
      status: 200,
    });
    expect(updatedPost.title).toBe("My Post Title");

    const { body: patchedPost } = await patch({
      url: `/api/v1/users/${userId}/posts/${postId}`,
      data: {
        content: "Patched content",
      },
      status: 200,
    });
    expect(patchedPost.title).toBe("My Post Title");
    expect(patchedPost.content).toBe("Patched content");

    const { body: onePost } = await get({
      url: `/api/v1/users/${userId}/posts/${postId}`,
      status: 200,
    });
    expect(onePost.title).toBe("My Post Title");

    await deleteIt({
      url: `/api/v1/users/${userId}/posts/${postId}`,
      status: 200,
    });
  });
});
