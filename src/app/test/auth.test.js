import { signInUser } from "../core/services/authService";
import firebase from "firebase";

jest.mock("firebase", () => ({
  auth: () => ({
    signInWithEmailAndPassword: jest.fn()
  })
}));

describe("Test Suite T1: User Authentication (F1)", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test Case 1: Valid username and password → Redirect to dashboard", async () => {
    // Arrange
    firebase.auth().signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "123" }
    });

    // Act
    const result = await signInUser("zbc@zbc.com", "zxcvbnm123");

    // Assert
    expect(result).toBe("/dashboard");
    expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalledWith(
      "zbc@zbc.com",
      "zxcvbnm123"
    );
  });

  test("Test Case 2: Invalid password → Invalid credentials message", async () => {
    // Arrange
    firebase.auth().signInWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Auth failed")
    );

    // Act & Assert
    await expect(
      signInUser("zbc@abc.com", "asdfghjkl123")
    ).rejects.toThrow("Invalid credentials");
  });

});
