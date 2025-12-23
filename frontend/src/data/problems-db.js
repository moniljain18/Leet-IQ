export const ADDITIONAL_PROBLEMS = {
    "valid-parentheses": {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        category: "Stack",
        description: {
            text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            notes: ["Open brackets must be closed by the same type of brackets.", "Open brackets must be closed in the correct order."]
        },
        examples: [
            { input: 's = "()"', output: "true" },
            { input: 's = "()[]{}"', output: "true" },
            { input: 's = "(]"', output: "false" }
        ],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};\n\n// Test cases\nconsole.log(isValid(\"()\")); // Expected: true\nconsole.log(isValid(\"()[]{}\")); // Expected: true\nconsole.log(isValid(\"(]\")); // Expected: false",
            python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass\n\n# Test cases\nprint(Solution().isValid(\"()\")) # Expected: True\nprint(Solution().isValid(\"()[]{}\")) # Expected: True\nprint(Solution().isValid(\"(]\")) # Expected: False",
            java: "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.isValid(\"()\")); // Expected: true\n        System.out.println(sol.isValid(\"()[]{}\")); // Expected: true\n        System.out.println(sol.isValid(\"(]\")); // Expected: false\n    }\n}"
        },
        expectedOutput: {
            javascript: "true\ntrue\nfalse",
            python: "True\nTrue\nFalse",
            java: "true\ntrue\nfalse"
        }
    },
    "merge-two-sorted-lists": {
        id: "merge-two-sorted-lists",
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        category: "Linked List",
        description: {
            text: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
            notes: ["The list should be made by splicing together the nodes of the first two lists."]
        },
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
        ],
        constraints: ["The number of nodes in both lists is in the range [0, 50]."],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nvar mergeTwoLists = function(list1, list2) {\n    \n};\n\n// Test cases\n// No console log for linked list usually, but generic:\nconsole.log(\"Run logic to test\");",
            python: "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n\n# Test cases\nprint(\"Run logic to test\")",
            java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}"
        },
        expectedOutput: {
            javascript: "Run logic to test",
            python: "Run logic to test",
            java: ""
        }
    },
    "best-time-to-buy-and-sell-stock": {
        id: "best-time-to-buy-and-sell-stock",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        category: "Array",
        description: {
            text: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
            notes: ["Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0."]
        },
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5" },
            { input: "prices = [7,6,4,3,1]", output: "0" }
        ],
        constraints: ["1 <= prices.length <= 10^5"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    \n};\n\n// Test cases\nconsole.log(maxProfit([7,1,5,3,6,4])); // Expected: 5\nconsole.log(maxProfit([7,6,4,3,1])); // Expected: 0",
            python: "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass\n\n# Test cases\nprint(Solution().maxProfit([7,1,5,3,6,4])) # Expected: 5\nprint(Solution().maxProfit([7,6,4,3,1])) # Expected: 0",
            java: "class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.maxProfit(new int[]{7,1,5,3,6,4})); // Expected: 5\n        System.out.println(sol.maxProfit(new int[]{7,6,4,3,1})); // Expected: 0\n    }\n}"
        },
        expectedOutput: {
            javascript: "5\n0",
            python: "5\n0",
            java: "5\n0"
        }
    },
    "climbing-stairs": {
        id: "climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "Easy",
        category: "DP",
        description: {
            text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            notes: []
        },
        examples: [
            { input: "n = 2", output: "2" },
            { input: "n = 3", output: "3" }
        ],
        constraints: ["1 <= n <= 45"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    \n};\n\n// Test cases\nconsole.log(climbStairs(2)); // Expected: 2\nconsole.log(climbStairs(3)); // Expected: 3",
            python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass\n\n# Test cases\nprint(Solution().climbStairs(2)) # Expected: 2\nprint(Solution().climbStairs(3)) # Expected: 3",
            java: "class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.climbStairs(2)); // Expected: 2\n        System.out.println(sol.climbStairs(3)); // Expected: 3\n    }\n}"
        },
        expectedOutput: {
            javascript: "2\n3",
            python: "2\n3",
            java: "2\n3"
        }
    },
    "valid-anagram": {
        id: "valid-anagram",
        title: "Valid Anagram",
        difficulty: "Easy",
        category: "String",
        description: {
            text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
            notes: []
        },
        examples: [
            { input: 's = "anagram", t = "nagaram"', output: "true" },
            { input: 's = "rat", t = "car"', output: "false" }
        ],
        constraints: ["1 <= s.length, t.length <= 5 * 10^4"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nvar isAnagram = function(s, t) {\n    \n};\n\n// Test cases\nconsole.log(isAnagram(\"anagram\", \"nagaram\")); // Expected: true\nconsole.log(isAnagram(\"rat\", \"car\")); // Expected: false",
            python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass\n\n# Test cases\nprint(Solution().isAnagram(\"anagram\", \"nagaram\")) # Expected: True\nprint(Solution().isAnagram(\"rat\", \"car\")) # Expected: False",
            java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.isAnagram(\"anagram\", \"nagaram\")); // Expected: true\n        System.out.println(sol.isAnagram(\"rat\", \"car\")); // Expected: false\n    }\n}"
        },
        expectedOutput: {
            javascript: "true\nfalse",
            python: "True\nFalse",
            java: "true\nfalse"
        }
    },
    "invert-binary-tree": {
        id: "invert-binary-tree",
        title: "Invert Binary Tree",
        difficulty: "Easy",
        category: "Tree",
        description: {
            text: "Given the root of a binary tree, invert the tree, and return its root.",
            notes: []
        },
        examples: [
            { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }
        ],
        constraints: ["The number of nodes in the tree is in the range [0, 100]."],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {TreeNode} root\n * @return {TreeNode}\n */\nvar invertTree = function(root) {\n    \n};\n\n// Test cases\nconsole.log(\"Run logic to test\");",
            python: "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        pass",
            java: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return null;\n    }\n}"
        }
    },
    "majority-element": {
        id: "majority-element",
        title: "Majority Element",
        difficulty: "Easy",
        category: "Array",
        description: {
            text: "Given an array nums of size n, return the majority element.",
            notes: []
        },
        examples: [
            { input: "nums = [3,2,3]", output: "3" },
            { input: "nums = [2,2,1,1,1,2,2]", output: "2" }
        ],
        constraints: ["n == nums.length"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar majorityElement = function(nums) {\n    \n};\n\n// Test cases\nconsole.log(majorityElement([3,2,3])); // Expected: 3\nconsole.log(majorityElement([2,2,1,1,1,2,2])); // Expected: 2",
            python: "class Solution:\n    def majorityElement(self, nums: List[int]) -> int:\n        pass\n\n# Test cases\nprint(Solution().majorityElement([3,2,3])) # Expected: 3\nprint(Solution().majorityElement([2,2,1,1,1,2,2])) # Expected: 2",
            java: "class Solution {\n    public int majorityElement(int[] nums) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.majorityElement(new int[]{3,2,3})); // Expected: 3\n        System.out.println(sol.majorityElement(new int[]{2,2,1,1,1,2,2})); // Expected: 2\n    }\n}"
        },
        expectedOutput: {
            javascript: "3\n2",
            python: "3\n2",
            java: "3\n2"
        }
    },
    "move-zeroes": {
        id: "move-zeroes",
        title: "Move Zeroes",
        difficulty: "Easy",
        category: "Two Pointers",
        description: {
            text: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.",
            notes: ["Note that you must do this in-place without making a copy of the array."]
        },
        examples: [
            { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }
        ],
        constraints: ["1 <= nums.length <= 10^4"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} nums\n * @return {void} Do not return anything, modify nums in-place instead.\n */\nvar moveZeroes = function(nums) {\n    \n};\n\n// Test cases\nlet nums = [0,1,0,3,12];\nmoveZeroes(nums);\nconsole.log(nums); // Expected: [1,3,12,0,0]",
            python: "class Solution:\n    def moveZeroes(self, nums: List[int]) -> None:\n        pass\n\n# Test cases\nnums = [0,1,0,3,12]\nSolution().moveZeroes(nums)\nprint(nums) # Expected: [1,3,12,0,0]",
            java: "class Solution {\n    public void moveZeroes(int[] nums) {\n        \n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {0,1,0,3,12};\n        sol.moveZeroes(nums);\n        System.out.println(java.util.Arrays.toString(nums)); // Expected: [1,3,12,0,0]\n    }\n}"
        },
        expectedOutput: {
            javascript: "[1,3,12,0,0]",
            python: "[1, 3, 12, 0, 0]",
            java: "[1, 3, 12, 0, 0]"
        }
    },
    "diameter-of-binary-tree": {
        id: "diameter-of-binary-tree",
        title: "Diameter of Binary Tree",
        difficulty: "Easy",
        category: "Tree",
        description: {
            text: "Given the root of a binary tree, return the length of the diameter of the tree.",
            notes: []
        },
        examples: [
            { input: "root = [1,2,3,4,5]", output: "3" }
        ],
        constraints: ["The number of nodes in the tree is in the range [1, 10^4]."],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {TreeNode} root\n * @return {number}\n */\nvar diameterOfBinaryTree = function(root) {\n    \n};\n\n// Test cases\nconsole.log(\"Run logic to test\");",
            python: "class Solution:\n    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        pass",
            java: "class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        return 0;\n    }\n}"
        }
    },
    "add-two-numbers": {
        id: "add-two-numbers",
        title: "Add Two Numbers",
        difficulty: "Medium",
        category: "Linked List",
        description: {
            text: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            notes: []
        },
        examples: [
            { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]" }
        ],
        constraints: ["The number of nodes in each linked list is in the range [1, 100]."],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};\n\n// Test cases\nconsole.log(\"Run logic to test\");",
            python: "class Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        pass",
            java: "class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        return null;\n    }\n}"
        }
    },
    "longest-substring-without-repeating-characters": {
        id: "longest-substring-without-repeating-characters",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        category: "Sliding Window",
        description: {
            text: "Given a string s, find the length of the longest substring without repeating characters.",
            notes: []
        },
        examples: [
            { input: 's = "abcabcbb"', output: "3" },
            { input: 's = "bbbbb"', output: "1" }
        ],
        constraints: ["0 <= s.length <= 5 * 10^4"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};\n\n// Test cases\nconsole.log(lengthOfLongestSubstring(\"abcabcbb\")); // Expected: 3\nconsole.log(lengthOfLongestSubstring(\"bbbbb\")); // Expected: 1",
            python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass\n\n# Test cases\nprint(Solution().lengthOfLongestSubstring(\"abcabcbb\")) # Expected: 3\nprint(Solution().lengthOfLongestSubstring(\"bbbbb\")) # Expected: 1",
            java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.lengthOfLongestSubstring(\"abcabcbb\")); // Expected: 3\n        System.out.println(sol.lengthOfLongestSubstring(\"bbbbb\")); // Expected: 1\n    }\n}"
        },
        expectedOutput: {
            javascript: "3\n1",
            python: "3\n1",
            java: "3\n1"
        }
    },
    "3sum": {
        id: "3sum",
        title: "3Sum",
        difficulty: "Medium",
        category: "Two Pointers",
        description: {
            text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
            notes: []
        },
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
        ],
        constraints: ["3 <= nums.length <= 3000"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nvar threeSum = function(nums) {\n    \n};\n\n// Test cases\nconsole.log(threeSum([-1,0,1,2,-1,-4])); // Expected: [[-1,-1,2],[-1,0,1]]",
            python: "class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        pass\n\n# Test cases\nprint(Solution().threeSum([-1,0,1,2,-1,-4])) # Expected: [[-1,-1,2],[-1,0,1]]",
            java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.threeSum(new int[]{-1,0,1,2,-1,-4})); // Expected: [[-1,-1,2],[-1,0,1]]\n    }\n}"
        },
        expectedOutput: {
            javascript: "[[-1,-1,2],[-1,0,1]]",
            python: "[[-1, -1, 2], [-1, 0, 1]]",
            java: "[[-1, -1, 2], [-1, 0, 1]]"
        }
    },
    "product-of-array-except-self": {
        id: "product-of-array-except-self",
        title: "Product of Array Except Self",
        difficulty: "Medium",
        category: "Array",
        description: {
            text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
            notes: []
        },
        examples: [
            { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }
        ],
        constraints: ["2 <= nums.length <= 10^5"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar productExceptSelf = function(nums) {\n    \n};\n\n// Test cases\nconsole.log(productExceptSelf([1,2,3,4])); // Expected: [24,12,8,6]",
            python: "class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        pass\n\n# Test cases\nprint(Solution().productExceptSelf([1,2,3,4])) # Expected: [24,12,8,6]",
            java: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(java.util.Arrays.toString(sol.productExceptSelf(new int[]{1,2,3,4}))); // Expected: [24,12,8,6]\n    }\n}"
        },
        expectedOutput: {
            javascript: "[24,12,8,6]",
            python: "[24, 12, 8, 6]",
            java: "[24, 12, 8, 6]"
        }
    },
    "group-anagrams": {
        id: "group-anagrams",
        title: "Group Anagrams",
        difficulty: "Medium",
        category: "String",
        description: {
            text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
            notes: []
        },
        examples: [
            { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
        ],
        constraints: ["1 <= strs.length <= 10^4"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nvar groupAnagrams = function(strs) {\n    \n};\n\n// Test cases\nconsole.log(groupAnagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]));",
            python: "class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        pass\n\n# Test cases\nprint(Solution().groupAnagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]))",
            java: "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.groupAnagrams(new String[]{\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"}));\n    }\n}"
        }
    },
    "number-of-islands": {
        id: "number-of-islands",
        title: "Number of Islands",
        difficulty: "Medium",
        category: "Graph",
        description: {
            text: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
            notes: []
        },
        examples: [
            { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" }
        ],
        constraints: ["m == grid.length", "1 <= m, n <= 300"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    \n};\n\n// Test cases\nlet grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]];\nconsole.log(numIslands(grid)); // Expected: 1",
            python: "class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        pass\n\n# Test cases\ngrid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]\nprint(Solution().numIslands(grid)) # Expected: 1",
            java: "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        char[][] grid = {{'1','1','1','1','0'},{'1','1','0','1','0'},{'1','1','0','0','0'},{'0','0','0','0','0'}};\n        System.out.println(sol.numIslands(grid)); // Expected: 1\n    }\n}"
        }
    },
    "rotting-oranges": {
        id: "rotting-oranges",
        title: "Rotting Oranges",
        difficulty: "Medium",
        category: "Graph",
        description: {
            text: "You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.",
            notes: []
        },
        examples: [
            { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" }
        ],
        constraints: ["m == grid.length", "1 <= m, n <= 10"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[][]} grid\n * @return {number}\n */\nvar orangesRotting = function(grid) {\n    \n};\n\n// Test cases\nconsole.log(orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // Expected: 4",
            python: "class Solution:\n    def orangesRotting(self, grid: List[List[int]]) -> int:\n        pass\n\n# Test cases\nprint(Solution().orangesRotting([[2,1,1],[1,1,0],[0,1,1]])) # Expected: 4",
            java: "class Solution {\n    public int orangesRotting(int[][] grid) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[][] grid = {{2,1,1},{1,1,0},{0,1,1}};\n        System.out.println(sol.orangesRotting(grid)); // Expected: 4\n    }\n}"
        },
        expectedOutput: {
            javascript: "4",
            python: "4",
            java: "4"
        }
    },
    "search-in-rotated-sorted-array": {
        id: "search-in-rotated-sorted-array",
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        category: "Binary Search",
        description: {
            text: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
            notes: []
        },
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }
        ],
        constraints: ["1 <= nums.length <= 5000"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nvar search = function(nums, target) {\n    \n};\n\n// Test cases\nconsole.log(search([4,5,6,7,0,1,2], 0)); // Expected: 4",
            python: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass\n\n# Test cases\nprint(Solution().search([4,5,6,7,0,1,2], 0)) # Expected: 4",
            java: "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.search(new int[]{4,5,6,7,0,1,2}, 0)); // Expected: 4\n    }\n}"
        },
        expectedOutput: {
            javascript: "4",
            python: "4",
            java: "4"
        }
    },
    "validate-binary-search-tree": {
        id: "validate-binary-search-tree",
        title: "Validate Binary Search Tree",
        difficulty: "Medium",
        category: "Tree",
        description: {
            text: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
            notes: []
        },
        examples: [
            { input: "root = [2,1,3]", output: "true" }
        ],
        constraints: ["The number of nodes in the tree is in the range [1, 10^4]."],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {TreeNode} root\n * @return {boolean}\n */\nvar isValidBST = function(root) {\n    \n};\n\n// Test cases\nconsole.log(\"Run logic to test\");",
            python: "class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        pass",
            java: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return false;\n    }\n}"
        }
    },
    "lowest-common-ancestor-of-a-binary-tree": {
        id: "lowest-common-ancestor-of-a-binary-tree",
        title: "Lowest Common Ancestor of a Binary Tree",
        difficulty: "Medium",
        category: "Tree",
        description: {
            text: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
            notes: []
        },
        examples: [
            { input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1", output: "3" }
        ],
        constraints: ["The number of nodes in the tree is in the range [2, 10^5]."],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {TreeNode} root\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {TreeNode}\n */\nvar lowestCommonAncestor = function(root, p, q) {\n    \n};\n\n// Test cases\nconsole.log(\"Run logic to test\");",
            python: "class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        pass",
            java: "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        return null;\n    }\n}"
        }
    },
    "course-schedule": {
        id: "course-schedule",
        title: "Course Schedule",
        difficulty: "Medium",
        category: "Graph",
        description: {
            text: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
            notes: []
        },
        examples: [
            { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }
        ],
        constraints: ["1 <= numCourses <= 2000"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nvar canFinish = function(numCourses, prerequisites) {\n    \n};\n\n// Test cases\nconsole.log(canFinish(2, [[1,0]])); // Expected: true",
            python: "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        pass\n\n# Test cases\nprint(Solution().canFinish(2, [[1,0]])) # Expected: True",
            java: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[][] prereqs = {{1,0}};\n        System.out.println(sol.canFinish(2, prereqs)); // Expected: true\n    }\n}"
        },
        expectedOutput: {
            javascript: "true",
            python: "True",
            java: "true"
        }
    },
    "median-of-two-sorted-arrays": {
        id: "median-of-two-sorted-arrays",
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        category: "Binary Search",
        description: {
            text: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
            notes: []
        },
        examples: [
            { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }
        ],
        constraints: ["1 <= m + n <= 2000"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};\n\n// Test cases\nconsole.log(findMedianSortedArrays([1,3], [2])); // Expected: 2.00000",
            python: "class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        pass\n\n# Test cases\nprint(Solution().findMedianSortedArrays([1,3], [2])) # Expected: 2.00000",
            java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.findMedianSortedArrays(new int[]{1,3}, new int[]{2})); // Expected: 2.00000\n    }\n}"
        }
    },
    "trapping-rain-water": {
        id: "trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "Hard",
        category: "Two Pointers",
        description: {
            text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            notes: []
        },
        examples: [
            { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }
        ],
        constraints: ["1 <= n <= 2 * 10^4"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} height\n * @return {number}\n */\nvar trap = function(height) {\n    \n};\n\n// Test cases\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6",
            python: "class Solution:\n    def trap(self, height: List[int]) -> int:\n        pass\n\n# Test cases\nprint(Solution().trap([0,1,0,2,1,0,1,3,2,1,2,1])) # Expected: 6",
            java: "class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // Expected: 6\n    }\n}"
        },
        expectedOutput: {
            javascript: "6",
            python: "6",
            java: "6"
        }
    },
    "merge-k-sorted-lists": {
        id: "merge-k-sorted-lists",
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        category: "Linked List",
        description: {
            text: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
            notes: []
        },
        examples: [
            { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
        ],
        constraints: ["k == lists.length", "0 <= k <= 10^4"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {ListNode[]} lists\n * @return {ListNode}\n */\nvar mergeKLists = function(lists) {\n    \n};\n\n// Test cases\nconsole.log(\"Run logic to test\");",
            python: "class Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        pass",
            java: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        return null;\n    }\n}"
        }
    },
    "regular-expression-matching": {
        id: "regular-expression-matching",
        title: "Regular Expression Matching",
        difficulty: "Hard",
        category: "DP",
        description: {
            text: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
            notes: []
        },
        examples: [
            { input: 's = "aa", p = "a"', output: "false" },
            { input: 's = "aa", p = "a*"', output: "true" }
        ],
        constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string} s\n * @param {string} p\n * @return {boolean}\n */\nvar isMatch = function(s, p) {\n    \n};\n\n// Test cases\nconsole.log(isMatch(\"aa\", \"a\")); // Expected: false\nconsole.log(isMatch(\"aa\", \"a*\")); // Expected: true",
            python: "class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        pass\n\n# Test cases\nprint(Solution().isMatch(\"aa\", \"a\")) # Expected: False\nprint(Solution().isMatch(\"aa\", \"a*\")) # Expected: True",
            java: "class Solution {\n    public boolean isMatch(String s, String p) {\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.isMatch(\"aa\", \"a\")); // Expected: false\n        System.out.println(sol.isMatch(\"aa\", \"a*\")); // Expected: true\n    }\n}"
        },
        expectedOutput: {
            javascript: "false\ntrue",
            python: "False\nTrue",
            java: "false\ntrue"
        }
    },
    "longest-valid-parentheses": {
        id: "longest-valid-parentheses",
        title: "Longest Valid Parentheses",
        difficulty: "Hard",
        category: "DP",
        description: {
            text: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
            notes: []
        },
        examples: [
            { input: 's = "(()"', output: "2" },
            { input: 's = ")()())"', output: "4" }
        ],
        constraints: ["0 <= s.length <= 3 * 10^4"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string} s\n * @return {number}\n */\nvar longestValidParentheses = function(s) {\n    \n};\n\n// Test cases\nconsole.log(longestValidParentheses(\"(()\")); // Expected: 2\nconsole.log(longestValidParentheses(\")()())\")); // Expected: 4",
            python: "class Solution:\n    def longestValidParentheses(self, s: str) -> int:\n        pass\n\n# Test cases\nprint(Solution().longestValidParentheses(\"(()\")) # Expected: 2\nprint(Solution().longestValidParentheses(\")()())\")) # Expected: 4",
            java: "class Solution {\n    public int longestValidParentheses(String s) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.longestValidParentheses(\"(()\")); // Expected: 2\n        System.out.println(sol.longestValidParentheses(\")()())\")); // Expected: 4\n    }\n}"
        },
        expectedOutput: {
            javascript: "2\n4",
            python: "2\n4",
            java: "2\n4"
        }
    },
    "edit-distance": {
        id: "edit-distance",
        title: "Edit Distance",
        difficulty: "Hard",
        category: "DP",
        description: {
            text: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
            notes: []
        },
        examples: [
            { input: 'word1 = "horse", word2 = "ros"', output: "3" }
        ],
        constraints: ["0 <= word1.length, word2.length <= 500"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string} word1\n * @param {string} word2\n * @return {number}\n */\nvar minDistance = function(word1, word2) {\n    \n};\n\n// Test cases\nconsole.log(minDistance(\"horse\", \"ros\")); // Expected: 3",
            python: "class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        pass\n\n# Test cases\nprint(Solution().minDistance(\"horse\", \"ros\")) # Expected: 3",
            java: "class Solution {\n    public int minDistance(String word1, String word2) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.minDistance(\"horse\", \"ros\")); // Expected: 3\n    }\n}"
        },
        expectedOutput: {
            javascript: "3",
            python: "3",
            java: "3"
        }
    },
    "largest-rectangle-in-histogram": {
        id: "largest-rectangle-in-histogram",
        title: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        category: "Stack",
        description: {
            text: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
            notes: []
        },
        examples: [
            { input: "heights = [2,1,5,6,2,3]", output: "10" }
        ],
        constraints: ["1 <= heights.length <= 10^5"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} heights\n * @return {number}\n */\nvar largestRectangleArea = function(heights) {\n    \n};\n\n// Test cases\nconsole.log(largestRectangleArea([2,1,5,6,2,3])); // Expected: 10",
            python: "class Solution:\n    def largestRectangleArea(self, heights: List[int]) -> int:\n        pass\n\n# Test cases\nprint(Solution().largestRectangleArea([2,1,5,6,2,3])) # Expected: 10",
            java: "class Solution {\n    public int largestRectangleArea(int[] heights) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.largestRectangleArea(new int[]{2,1,5,6,2,3})); // Expected: 10\n    }\n}"
        },
        expectedOutput: {
            javascript: "10",
            python: "10",
            java: "10"
        }
    },
    "sliding-window-maximum": {
        id: "sliding-window-maximum",
        title: "Sliding Window Maximum",
        difficulty: "Hard",
        category: "Sliding Window",
        description: {
            text: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
            notes: []
        },
        examples: [
            { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" }
        ],
        constraints: ["1 <= nums.length <= 10^5"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nvar maxSlidingWindow = function(nums, k) {\n    \n};\n\n// Test cases\nconsole.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)); // Expected: [3,3,5,5,6,7]",
            python: "class Solution:\n    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:\n        pass\n\n# Test cases\nprint(Solution().maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)) # Expected: [3,3,5,5,6,7]",
            java: "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(java.util.Arrays.toString(sol.maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3))); // Expected: [3,3,5,5,6,7]\n    }\n}"
        },
        expectedOutput: {
            javascript: "[3,3,5,5,6,7]",
            python: "[3, 3, 5, 5, 6, 7]",
            java: "[3, 3, 5, 5, 6, 7]"
        }
    },
    "serialize-and-deserialize-binary-tree": {
        id: "serialize-and-deserialize-binary-tree",
        title: "Serialize and Deserialize Binary Tree",
        difficulty: "Hard",
        category: "Tree",
        description: {
            text: "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Design an algorithm to serialize and deserialize a binary tree.",
            notes: []
        },
        examples: [
            { input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" }
        ],
        constraints: [],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * Definition for a binary tree node.\n * function TreeNode(val) {\n *     this.val = val;\n *     this.left = this.right = null;\n * }\n */\n\n/**\n * Encodes a tree to a single string.\n *\n * @param {TreeNode} root\n * @return {string}\n */\nvar serialize = function(root) {\n    \n};\n\n/**\n * Decodes your encoded data to tree.\n *\n * @param {string} data\n * @return {TreeNode}\n */\nvar deserialize = function(data) {\n    \n};\n\n/**\n * Your functions will be called as such:\n * deserialize(serialize(root));\n */",
            python: "# Definition for a binary tree node.\n# class TreeNode(object):\n#     def __init__(self, x):\n#         self.val = x\n#         self.left = None\n#         self.right = None\n\nclass Codec:\n\n    def serialize(self, root):\n        \"\"\"Encodes a tree to a single string.\n        \n        :type root: TreeNode\n        :rtype: str\n        \"\"\"\n        \n\n    def deserialize(self, data):\n        \"\"\"Decodes your encoded data to tree.\n        \n        :type data: str\n        :rtype: TreeNode\n        \"\"\"\n        \n\n# Your Codec object will be instantiated and called as such:\n# ser = Codec()\n# deser = Codec()\n# ans = deser.deserialize(ser.serialize(root))",
            java: "public class Codec {\n\n    // Encodes a tree to a single string.\n    public String serialize(TreeNode root) {\n        return \"\";\n    }\n\n    // Decodes your encoded data to tree.\n    public TreeNode deserialize(String data) {\n        return null;\n    }\n}"
        }
    },
    "word-ladder": {
        id: "word-ladder",
        title: "Word Ladder",
        difficulty: "Hard",
        category: "Graph",
        description: {
            text: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words such that: The first word is beginWord, the last is endWord, and each adjacent pair differs by exactly one character. Every intermediate word must exist in wordList. Return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
            notes: []
        },
        examples: [
            { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5", explanation: "hit -> hot -> dot -> dog -> cog" }
        ],
        constraints: ["1 <= beginWord.length <= 10"],
        timeLimit: 1000,
        memoryLimit: 128,
        starterCode: {
            javascript: "/**\n * @param {string} beginWord\n * @param {string} endWord\n * @param {string[]} wordList\n * @return {number}\n */\nvar ladderLength = function(beginWord, endWord, wordList) {\n    \n};\n\n// Test cases\nconsole.log(ladderLength(\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"])); // Expected: 5",
            python: "class Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:\n        pass\n\n# Test cases\nprint(Solution().ladderLength(\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"])) # Expected: 5",
            java: "class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.ladderLength(\"hit\", \"cog\", java.util.Arrays.asList(\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"))); // Expected: 5\n    }\n}"
        },
        expectedOutput: {
            javascript: "5",
            python: "5",
            java: "5"
        }
    },
};