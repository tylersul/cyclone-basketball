// Import the middleware object and HTTP mocking utility
const middlewareObject = require('../middleware');
const httpMocks = require('node-mocks-http');

/**
 * Test Suite for Authentication Middleware
 * 
 * This test suite focuses on verifying the behavior of authentication and authorization middleware
 * It covers two main middleware functions:
 * 1. isLoggedIn: Checks if a user is authenticated
 * 2. isAdmin: Checks if an authenticated user has admin privileges
 */
describe('Middleware Authentication', () => {
  // Declare variables to be used across test cases
  let mockRequest, mockResponse, nextFunction;

  /**
   * Setup function that runs before each test
   * Creates fresh mock objects for request, response, and next function
   * Ensures each test starts with a clean slate
   */
  beforeEach(() => {
    // Create mock HTTP request object
    mockRequest = httpMocks.createRequest();
    
    // Create mock HTTP response object
    mockResponse = httpMocks.createResponse();
    
    // Create a mock next function using Jest's mock function
    nextFunction = jest.fn();
  });

  /**
   * Test Group: isLoggedIn Middleware
   * Verifies the behavior of the authentication check middleware
   */
  describe('isLoggedIn Middleware', () => {
    /**
     * Test Case: Authenticated User
     * Ensures that authenticated users can proceed to the next middleware/route
     */
    test('should call next if user is authenticated', () => {
      // Simulate an authenticated user
      mockRequest.isAuthenticated = () => true;
      
      // Call the isLoggedIn middleware
      middlewareObject.isLoggedIn(mockRequest, mockResponse, nextFunction);
      
      // Verify that the next function was called, allowing access
      expect(nextFunction).toHaveBeenCalled();
    });

    /**
     * Test Case: Unauthenticated User
     * Ensures that unauthenticated users are redirected to the login page
     * with an appropriate error message
     */
    test('should redirect to login if user is not authenticated', () => {
      // Simulate an unauthenticated user
      mockRequest.isAuthenticated = () => false;
      
      // Mock the flash message method
      mockRequest.flash = jest.fn();
      
      // Call the isLoggedIn middleware
      middlewareObject.isLoggedIn(mockRequest, mockResponse, nextFunction);
      
      // Verify error message is set
      expect(mockRequest.flash).toHaveBeenCalledWith('error', 'Please login to continue.');
      
      // Verify redirect to login page
      expect(mockResponse._getRedirectUrl()).toBe('/login');
      
      // Verify next function is not called
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  /**
   * Test Group: isAdmin Middleware
   * Verifies the behavior of the admin authorization middleware
   */
  describe('isAdmin Middleware', () => {
    /**
     * Test Case: Admin User
     * Ensures that admin users can proceed to the next middleware/route
     */
    test('should call next if user is an admin', () => {
      // Simulate an authenticated admin user
      mockRequest.isAuthenticated = () => true;
      mockRequest.user = { isAdmin: true };
      
      // Call the isAdmin middleware
      middlewareObject.isAdmin(mockRequest, mockResponse, nextFunction);
      
      // Verify that the next function was called, allowing access
      expect(nextFunction).toHaveBeenCalled();
    });

    /**
     * Test Case: Non-Admin User
     * Ensures that non-admin users are redirected back with an error message
     */
    test('should redirect back if user is not an admin', () => {
      // Simulate an authenticated non-admin user
      mockRequest.isAuthenticated = () => true;
      mockRequest.user = { isAdmin: false };
      
      // Mock the flash message method
      mockRequest.flash = jest.fn();
      
      // Call the isAdmin middleware
      middlewareObject.isAdmin(mockRequest, mockResponse, nextFunction);
      
      // Verify error message is set
      expect(mockRequest.flash).toHaveBeenCalledWith('error', 'You must be an admin to access this page.');
      
      // Verify redirect back to previous page
      expect(mockResponse._getRedirectUrl()).toBe('back');
      
      // Verify next function is not called
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
