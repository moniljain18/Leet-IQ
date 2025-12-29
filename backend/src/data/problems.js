export const PROBLEMS = {
    "two-sum": {
        id: "two-sum",
        functionName: "twoSum",
        testCases: [
            { params: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { params: [[3, 2, 4], 6], expected: [1, 2] },
            { params: [[3, 3], 6], expected: [0, 1] }
        ]
    },
    "reverse-string": {
        id: "reverse-string",
        functionName: "reverseString",
        testCases: [
            { params: [["h", "e", "l", "l", "o"]], expected: ["o", "l", "l", "e", "h"] },
            { params: [["H", "a", "n", "n", "a", "h"]], expected: ["h", "a", "n", "n", "a", "H"] }
        ]
    },
    "valid-palindrome": {
        id: "valid-palindrome",
        functionName: "isPalindrome",
        testCases: [
            { params: ["A man, a plan, a canal: Panama"], expected: true },
            { params: ["race a car"], expected: false },
            { params: [" "], expected: true }
        ]
    },
    "maximum-subarray": {
        id: "maximum-subarray",
        functionName: "maxSubArray",
        testCases: [
            { params: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
            { params: [[1]], expected: 1 },
            { params: [[5, 4, -1, 7, 8]], expected: 23 }
        ]
    },
    "container-with-most-water": {
        id: "container-with-most-water",
        functionName: "maxArea",
        testCases: [
            { params: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
            { params: [[1, 1]], expected: 1 }
        ]
    },
    "valid-parentheses": {
        id: "valid-parentheses",
        functionName: "isValid",
        testCases: [
            { params: ["()"], expected: true },
            { params: ["()[]{}"], expected: true },
            { params: ["(]"], expected: false }
        ]
    },
    "merge-two-sorted-lists": {
        id: "merge-two-sorted-lists",
        functionName: "mergeTwoLists",
        testCases: [
            { params: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
            { params: [[], []], expected: [] },
            { params: [[], [0]], expected: [0] }
        ]
    },
    "climbing-stairs": {
        id: "climbing-stairs",
        functionName: "climbStairs",
        testCases: [
            { params: [2], expected: 2 },
            { params: [3], expected: 3 },
            { params: [5], expected: 8 }
        ]
    },
    "valid-anagram": {
        id: "valid-anagram",
        functionName: "isAnagram",
        testCases: [
            { params: ["anagram", "nagaram"], expected: true },
            { params: ["rat", "car"], expected: false },
            { params: ["a", "a"], expected: true }
        ]
    },
    "majority-element": {
        id: "majority-element",
        functionName: "majorityElement",
        testCases: [
            { params: [[3, 2, 3]], expected: 3 },
            { params: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 }
        ]
    },
    "move-zeroes": {
        id: "move-zeroes",
        functionName: "moveZeroes",
        testCases: [
            { params: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
            { params: [[0]], expected: [0] }
        ]
    },
    "add-two-numbers": {
        id: "add-two-numbers",
        functionName: "addTwoNumbers",
        testCases: [
            { params: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
            { params: [[0], [0]], expected: [0] },
            { params: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] }
        ]
    },
    "longest-substring-without-repeating-characters": {
        id: "longest-substring-without-repeating-characters",
        functionName: "lengthOfLongestSubstring",
        testCases: [
            { params: ["abcabcbb"], expected: 3 },
            { params: ["bbbbb"], expected: 1 },
            { params: ["pwwkew"], expected: 3 }
        ]
    },
    "3sum": {
        id: "3sum",
        functionName: "threeSum",
        testCases: [
            { params: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
            { params: [[], 0], expected: [] },
            { params: [[0], 0], expected: [] }
        ]
    },
    "product-of-array-except-self": {
        id: "product-of-array-except-self",
        functionName: "productExceptSelf",
        testCases: [
            { params: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
            { params: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
        ]
    },
    "group-anagrams": {
        id: "group-anagrams",
        functionName: "groupAnagrams",
        testCases: [
            { params: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
            { params: [[""]], expected: [[""]] },
            { params: [["a"]], expected: [["a"]] }
        ]
    },
    "rotting-oranges": {
        id: "rotting-oranges",
        functionName: "orangesRotting",
        testCases: [
            { params: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
            { params: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
            { params: [[[0, 2]]], expected: 0 }
        ]
    },
    "search-in-rotated-sorted-array": {
        id: "search-in-rotated-sorted-array",
        functionName: "search",
        testCases: [
            { params: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
            { params: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
            { params: [[1], 0], expected: -1 }
        ]
    },
    "trapping-rain-water": {
        id: "trapping-rain-water",
        functionName: "trap",
        testCases: [
            { params: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
            { params: [[4, 2, 0, 3, 2, 5]], expected: 9 }
        ]
    },
    "fizz-buzz": {
        id: "fizz-buzz",
        functionName: "fizzBuzz",
        testCases: [
            { params: [3], expected: ["1", "2", "Fizz"] },
            { params: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
            { params: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] }
        ]
    },
    "single-number": {
        id: "single-number",
        functionName: "singleNumber",
        testCases: [
            { params: [[2, 2, 1]], expected: 1 },
            { params: [[4, 1, 2, 1, 2]], expected: 4 },
            { params: [[1]], expected: 1 }
        ]
    }
};
