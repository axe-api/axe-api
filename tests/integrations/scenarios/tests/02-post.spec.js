import { get, post, put, deleteIt, truncate } from "./helper.js";
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
      url: "/api/users/1/posts",
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
    const { body: user } = await post({ url: "/api/users", data, status: 200 });
    expect(user.email).toBe("foo@bar.com");
    expect(user.created_at).not.toBeNull();
    expect(user.fullname).toBe("John Doe");

    const { body: userPaginate } = await get({
      url: "/api/users?with=posts",
      status: 200,
    });
    expect(userPaginate.data.length).toBe(1);
    expect(userPaginate.data[0].posts.length).toBe(0);

    const { body: createdPost } = await post({
      url: "/api/users/1/posts",
      data: {
        title: "My Post",
        content: "This is the best post ever",
      },
      status: 200,
    });
    expect(createdPost.title).toBe("My Post");
    expect(createdPost.user_id).toBe(1);

    const { body: emptyUserPaginate } = await get({
      url: "/api/users?with=posts",
      status: 200,
    });
    expect(emptyUserPaginate.data.length).toBe(1);
    expect(emptyUserPaginate.data[0].posts.length).toBe(1);
    expect(emptyUserPaginate.data[0].posts[0].title).toBe("My Post");

    const { body: postPaginate } = await get({
      url: "/api/users/1/posts?with=user{name|surname}",
      status: 200,
    });
    expect(postPaginate.data.length).toBe(1);
    expect(postPaginate.data[0].title).toBe("My Post");
    expect(postPaginate.data[0].user.fullname).toBe("John Doe");
    expect(postPaginate.data[0].user.created_at).toBeUndefined();

    const { body: updatedPost } = await put({
      url: "/api/users/1/posts/1",
      data: {
        title: "My Post Title",
        content: "This is the best post ever",
      },
      status: 200,
    });
    expect(updatedPost.title).toBe("My Post Title");

    const { body: onePost } = await get({
      url: "/api/users/1/posts/1",
      status: 200,
    });
    expect(onePost.title).toBe("My Post Title");

    await deleteIt({
      url: "/api/users/1/posts/1",
      status: 200,
    });
  });

  test("should not be able to get the post if the post has been deleted", async () => {
    await get({
      url: "/api/users/1/posts/666",
      status: 404,
    });
  });
});
