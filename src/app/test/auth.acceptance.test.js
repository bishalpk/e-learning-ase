import firebase from "firebase";
import { signInUser, signOutUser } from "../core/services/authService";

jest.mock("firebase", () => ({
  auth: () => ({
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn()
  }),
  database: () => ({
    ref: () => ({
      once: jest.fn().mockResolvedValue({
        val: () => ({
          info: {
            displayName: "Test User",
            email: "zbc@zbc.com"
          }
        })
      })
    })
  })
}));

describe("Acceptance Test: User Authentication Flow", () => {

  test("User logs in, accesses dashboard, and logs out", async () => {

    // LOGIN
    firebase.auth().signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "123" }
    });

    const route = await signInUser("zbc@zbc.com", "zxcvbnm123");
    expect(route).toBe("/dashboard");

    // DASHBOARD ACCESS (simulate auth state)
    let authCallback;
    firebase.auth().onAuthStateChanged.mockImplementation((cb) => {
      authCallback = cb;
    });

    authCallback({ uid: "123" });

    const snapshot = await firebase.database().ref("/users/123/info").once("value");
    const userInfo = snapshot.val();

    expect(userInfo.displayName).toBe("Test User");

    // LOGOUT
    await signOutUser();
    expect(firebase.auth().signOut).toHaveBeenCalled();
  });

});
