import mongoose from 'mongoose';
import Problem from './src/models/Problem.js';
import { env } from './src/lib/env.js';

/**
 * Add starter code with console.log test cases for all problems
 */
const STARTER_CODE_WITH_TESTS = {
    'contains-duplicate': {
        javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", containsDuplicate([1,2,3,1])); // Expected: true
console.log("Test 2:", containsDuplicate([1,2,3,4])); // Expected: false
console.log("Test 3:", containsDuplicate([1,1,1,3,3,4,3,2,4,2])); // Expected: true`,
        python: `def containsDuplicate(nums: list[int]) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", containsDuplicate([1,2,3,1]))  # Expected: True
print("Test 2:", containsDuplicate([1,2,3,4]))  # Expected: False
print("Test 3:", containsDuplicate([1,1,1,3,3,4,3,2,4,2]))  # Expected: True`,
        java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'valid-anagram': {
        javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isAnagram("anagram", "nagaram")); // Expected: true
console.log("Test 2:", isAnagram("rat", "car")); // Expected: false`,
        python: `def isAnagram(s: str, t: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isAnagram("anagram", "nagaram"))  # Expected: True
print("Test 2:", isAnagram("rat", "car"))  # Expected: False`,
        java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        // Your code here
        
    }
};`
    },
    'valid-palindrome': {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log("Test 2:", isPalindrome("race a car")); // Expected: false
console.log("Test 3:", isPalindrome(" ")); // Expected: true`,
        python: `def isPalindrome(s: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print("Test 2:", isPalindrome("race a car"))  # Expected: False
print("Test 3:", isPalindrome(" "))  # Expected: True`,
        java: `class Solution {
    public boolean isPalindrome(String s) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        // Your code here
        
    }
};`
    },
    '3sum': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", threeSum([-1,0,1,2,-1,-4])); // Expected: [[-1,-1,2],[-1,0,1]]
console.log("Test 2:", threeSum([0,1,1])); // Expected: []
console.log("Test 3:", threeSum([0,0,0])); // Expected: [[0,0,0]]`,
        python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Your code here
    pass

# Test cases
print("Test 1:", threeSum([-1,0,1,2,-1,-4]))  # Expected: [[-1,-1,2],[-1,0,1]]
print("Test 2:", threeSum([0,1,1]))  # Expected: []
print("Test 3:", threeSum([0,0,0]))  # Expected: [[0,0,0]]`,
        java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'best-time-to-buy-and-sell-stock': {
        javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", maxProfit([7,1,5,3,6,4])); // Expected: 5
console.log("Test 2:", maxProfit([7,6,4,3,1])); // Expected: 0`,
        python: `def maxProfit(prices: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", maxProfit([7,1,5,3,6,4]))  # Expected: 5
print("Test 2:", maxProfit([7,6,4,3,1]))  # Expected: 0`,
        java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Your code here
        
    }
};`
    },
    'valid-parentheses': {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isValid("()")); // Expected: true
console.log("Test 2:", isValid("()[]{}")); // Expected: true
console.log("Test 3:", isValid("(]")); // Expected: false
console.log("Test 4:", isValid("([)]")); // Expected: false
console.log("Test 5:", isValid("{[]}")); // Expected: true`,
        python: `def isValid(s: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isValid("()"))  # Expected: True
print("Test 2:", isValid("()[]{}"))  # Expected: True
print("Test 3:", isValid("(]"))  # Expected: False
print("Test 4:", isValid("([)]"))  # Expected: False
print("Test 5:", isValid("{[]}"))  # Expected: True`,
        java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    bool isValid(string s) {
        // Your code here
        
    }
};`
    },
    'daily-temperatures': {
        javascript: `/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", dailyTemperatures([73,74,75,71,69,72,76,73])); // Expected: [1,1,4,2,1,1,0,0]
console.log("Test 2:", dailyTemperatures([30,40,50,60])); // Expected: [1,1,1,0]
console.log("Test 3:", dailyTemperatures([30,60,90])); // Expected: [1,1,0]`,
        python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", dailyTemperatures([73,74,75,71,69,72,76,73]))  # Expected: [1,1,4,2,1,1,0,0]
print("Test 2:", dailyTemperatures([30,40,50,60]))  # Expected: [1,1,1,0]
print("Test 3:", dailyTemperatures([30,60,90]))  # Expected: [1,1,0]`,
        java: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        // Your code here
        
    }
};`
    },
    'binary-search': {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", search([-1,0,3,5,9,12], 9)); // Expected: 4
console.log("Test 2:", search([-1,0,3,5,9,12], 2)); // Expected: -1`,
        python: `def search(nums: list[int], target: int) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", search([-1,0,3,5,9,12], 9))  # Expected: 4
print("Test 2:", search([-1,0,3,5,9,12], 2))  # Expected: -1`,
        java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Your code here
        
    }
};`
    },
    'reverse-linked-list': {
        javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function reverseList(head) {
    // Your code here
    
}

// Test cases (arrays represent linked lists)
// Example: [1,2,3,4,5] -> [5,4,3,2,1]
// Example: [1,2] -> [2,1]`,
        python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here
        pass

# Test cases (arrays represent linked lists)
# Example: [1,2,3,4,5] -> [5,4,3,2,1]
# Example: [1,2] -> [2,1]`,
        java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Your code here
        
    }
}`,
        cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Your code here
        
    }
};`
    },
    'merge-two-sorted-lists': {
        javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
function mergeTwoLists(list1, list2) {
    // Your code here
    
}

// Test cases (arrays represent linked lists)
// Example: list1 = [1,2,4], list2 = [1,3,4] -> [1,1,2,3,4,4]
// Example: list1 = [], list2 = [] -> []`,
        python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here
        pass

# Test cases (arrays represent linked lists)
# Example: list1 = [1,2,4], list2 = [1,3,4] -> [1,1,2,3,4,4]
# Example: list1 = [], list2 = [] -> []`,
        java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your code here
        
    }
}`,
        cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Your code here
        
    }
};`
    },
    'invert-binary-tree': {
        javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
function invertTree(root) {
    // Your code here
    
}

// Test cases (arrays represent level-order traversal)
// Example: [4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]
// Example: [2,1,3] -> [2,3,1]`,
        python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        # Your code here
        pass

# Test cases (arrays represent level-order traversal)
# Example: [4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]
# Example: [2,1,3] -> [2,3,1]`,
        java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Your code here
        
    }
}`,
        cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Your code here
        
    }
};`
    },
    'maximum-depth-of-binary-tree': {
        javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
function maxDepth(root) {
    // Your code here
    
}

// Test cases (arrays represent level-order traversal)
// Example: [3,9,20,null,null,15,7] -> 3
// Example: [1,null,2] -> 2`,
        python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        # Your code here
        pass

# Test cases (arrays represent level-order traversal)
# Example: [3,9,20,null,null,15,7] -> 3
# Example: [1,null,2] -> 2`,
        java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        // Your code here
        
    }
}`,
        cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Your code here
        
    }
};`
    },
    'kth-largest-element-in-an-array': {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums, k) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", findKthLargest([3,2,1,5,6,4], 2)); // Expected: 5
console.log("Test 2:", findKthLargest([3,2,3,1,2,4,5,5,6], 4)); // Expected: 4`,
        python: `def findKthLargest(nums: list[int], k: int) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", findKthLargest([3,2,1,5,6,4], 2))  # Expected: 5
print("Test 2:", findKthLargest([3,2,3,1,2,4,5,5,6], 4))  # Expected: 4`,
        java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Your code here
        
    }
};`
    },
    'subsets': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsets(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", subsets([1,2,3])); // Expected: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
console.log("Test 2:", subsets([0])); // Expected: [[],[0]]`,
        python: `def subsets(nums: list[int]) -> list[list[int]]:
    # Your code here
    pass

# Test cases
print("Test 1:", subsets([1,2,3]))  # Expected: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
print("Test 2:", subsets([0]))  # Expected: [[],[0]]`,
        java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'climbing-stairs': {
        javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", climbStairs(2)); // Expected: 2
console.log("Test 2:", climbStairs(3)); // Expected: 3
console.log("Test 3:", climbStairs(4)); // Expected: 5`,
        python: `def climbStairs(n: int) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", climbStairs(2))  # Expected: 2
print("Test 2:", climbStairs(3))  # Expected: 3
print("Test 3:", climbStairs(4))  # Expected: 5`,
        java: `class Solution {
    public int climbStairs(int n) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Your code here
        
    }
};`
    },
    'coin-change': {
        javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", coinChange([1,2,5], 11)); // Expected: 3 (5+5+1)
console.log("Test 2:", coinChange([2], 3)); // Expected: -1
console.log("Test 3:", coinChange([1], 0)); // Expected: 0`,
        python: `def coinChange(coins: list[int], amount: int) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", coinChange([1,2,5], 11))  # Expected: 3 (5+5+1)
print("Test 2:", coinChange([2], 3))  # Expected: -1
print("Test 3:", coinChange([1], 0))  # Expected: 0`,
        java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Your code here
        
    }
};`
    },
    'number-of-islands': {
        javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
])); // Expected: 1
console.log("Test 2:", numIslands([
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
])); // Expected: 3`,
        python: `def numIslands(grid: list[list[str]]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]))  # Expected: 1
print("Test 2:", numIslands([
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]))  # Expected: 3`,
        java: `class Solution {
    public int numIslands(char[][] grid) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Your code here
        
    }
};`
    },
    'container-with-most-water': {
        javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log("Test 2:", maxArea([1,1])); // Expected: 1`,
        python: `def maxArea(height: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print("Test 2:", maxArea([1,1]))  # Expected: 1`,
        java: `class Solution {
    public int maxArea(int[] height) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        // Your code here
        
    }
};`
    },
    'group-anagrams': {
        javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", groupAnagrams(["eat","tea","tan","ate","nat","bat"])); 
// Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]
console.log("Test 2:", groupAnagrams([""])); // Expected: [[""]]
console.log("Test 3:", groupAnagrams(["a"])); // Expected: [["a"]]`,
        python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Your code here
    pass

# Test cases
print("Test 1:", groupAnagrams(["eat","tea","tan","ate","nat","bat"]))
# Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]
print("Test 2:", groupAnagrams([""]))  # Expected: [[""]]
print("Test 3:", groupAnagrams(["a"]))  # Expected: [["a"]]`,
        java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Your code here
        
    }
};`
    },
    'top-k-frequent-elements': {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function topKFrequent(nums, k) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", topKFrequent([1,1,1,2,2,3], 2)); // Expected: [1,2]
console.log("Test 2:", topKFrequent([1], 1)); // Expected: [1]`,
        python: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", topKFrequent([1,1,1,2,2,3], 2))  # Expected: [1,2]
print("Test 2:", topKFrequent([1], 1))  # Expected: [1]`,
        java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // Your code here
        
    }
};`
    },
    'longest-consecutive-sequence': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function longestConsecutive(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", longestConsecutive([100,4,200,1,3,2])); // Expected: 4 (sequence: [1,2,3,4])
console.log("Test 2:", longestConsecutive([0,3,7,2,5,8,4,6,0,1])); // Expected: 9`,
        python: `def longestConsecutive(nums: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", longestConsecutive([100,4,200,1,3,2]))  # Expected: 4 (sequence: [1,2,3,4])
print("Test 2:", longestConsecutive([0,3,7,2,5,8,4,6,0,1]))  # Expected: 9`,
        java: `class Solution {
    public int longestConsecutive(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'product-of-array-except-self': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", productExceptSelf([1,2,3,4])); // Expected: [24,12,8,6]
console.log("Test 2:", productExceptSelf([-1,1,0,-3,3])); // Expected: [0,0,9,0,0]`,
        python: `def productExceptSelf(nums: list[int]) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", productExceptSelf([1,2,3,4]))  # Expected: [24,12,8,6]
print("Test 2:", productExceptSelf([-1,1,0,-3,3]))  # Expected: [0,0,9,0,0]`,
        java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'trapping-rain-water': {
        javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6
console.log("Test 2:", trap([4,2,0,3,2,5])); // Expected: 9`,
        python: `def trap(height: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # Expected: 6
print("Test 2:", trap([4,2,0,3,2,5]))  # Expected: 9`,
        java: `class Solution {
    public int trap(int[] height) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        // Your code here
        
    }
};`
    },
    'median-of-two-sorted-arrays': {
        javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", findMedianSortedArrays([1,3], [2])); // Expected: 2.0
console.log("Test 2:", findMedianSortedArrays([1,2], [3,4])); // Expected: 2.5`,
        python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    # Your code here
    pass

# Test cases
print("Test 1:", findMedianSortedArrays([1,3], [2]))  # Expected: 2.0
print("Test 2:", findMedianSortedArrays([1,2], [3,4]))  # Expected: 2.5`,
        java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Your code here
        
    }
};`
    },
    'longest-valid-parentheses': {
        javascript: `/**
 * @param {string} s
 * @return {number}
 */
function longestValidParentheses(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", longestValidParentheses("(()")); // Expected: 2
console.log("Test 2:", longestValidParentheses(")()())")); // Expected: 4
console.log("Test 3:", longestValidParentheses("")); // Expected: 0`,
        python: `def longestValidParentheses(s: str) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", longestValidParentheses("(()"))  # Expected: 2
print("Test 2:", longestValidParentheses(")()())"))  # Expected: 4
print("Test 3:", longestValidParentheses(""))  # Expected: 0`,
        java: `class Solution {
    public int longestValidParentheses(String s) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int longestValidParentheses(string s) {
        // Your code here
        
    }
};`
    },
    // Legacy problems from old seed (keeping for backwards compatibility)
    'two-sum': {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log("Test 2:", twoSum([3,2,4], 6)); // Expected: [1,2]
console.log("Test 3:", twoSum([3,3], 6)); // Expected: [0,1]`,
        python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass

# Test cases
print("Test 1:", twoSum([2,7,11,15], 9))  # Expected: [0,1]
print("Test 2:", twoSum([3,2,4], 6))  # Expected: [1,2]
print("Test 3:", twoSum([3,3], 6))  # Expected: [0,1]`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};`
    },
    'reverse-string': {
        javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Your code here
    
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log("Test 1:", test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log("Test 2:", test2); // Expected: ["h","a","n","n","a","H"]`,
        python: `def reverseString(s: list[str]) -> None:
    # Your code here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print("Test 1:", test1)  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print("Test 2:", test2)  # Expected: ["h","a","n","n","a","H"]`,
        java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here
        
    }
};`
    },
    'maximum-subarray': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log("Test 2:", maxSubArray([1])); // Expected: 1
console.log("Test 3:", maxSubArray([5,4,-1,7,8])); // Expected: 23`,
        python: `def maxSubArray(nums: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print("Test 2:", maxSubArray([1]))  # Expected: 1
print("Test 3:", maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
        java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'majority-element': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function majorityElement(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", majorityElement([3,2,3])); // Expected: 3
console.log("Test 2:", majorityElement([2,2,1,1,1,2,2])); // Expected: 2`,
        python: `def majorityElement(nums: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", majorityElement([3,2,3]))  # Expected: 3
print("Test 2:", majorityElement([2,2,1,1,1,2,2]))  # Expected: 2`,
        java: `class Solution {
    public int majorityElement(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'move-zeroes': {
        javascript: `/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums) {
    // Your code here
    
}

// Test cases
let test1 = [0,1,0,3,12];
moveZeroes(test1);
console.log("Test 1:", test1); // Expected: [1,3,12,0,0]

let test2 = [0];
moveZeroes(test2);
console.log("Test 2:", test2); // Expected: [0]`,
        python: `def moveZeroes(nums: list[int]) -> None:
    # Your code here
    pass

# Test cases
test1 = [0,1,0,3,12]
moveZeroes(test1)
print("Test 1:", test1)  # Expected: [1,3,12,0,0]

test2 = [0]
moveZeroes(test2)
print("Test 2:", test2)  # Expected: [0]`,
        java: `class Solution {
    public void moveZeroes(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'add-two-numbers': {
        javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function addTwoNumbers(l1, l2) {
    // Your code here
    
}

// Test cases (arrays represent linked lists)
// Example: [2,4,3] + [5,6,4] -> [7,0,8] (342 + 465 = 807)
// Example: [0] + [0] -> [0]`,
        python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here
        pass

# Test cases (arrays represent linked lists)
# Example: [2,4,3] + [5,6,4] -> [7,0,8] (342 + 465 = 807)
# Example: [0] + [0] -> [0]`,
        java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Your code here
        
    }
}`,
        cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Your code here
        
    }
};`
    },
    'longest-substring-without-repeating-characters': {
        javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", lengthOfLongestSubstring("abcabcbb")); // Expected: 3 ("abc")
console.log("Test 2:", lengthOfLongestSubstring("bbbbb")); // Expected: 1 ("b")
console.log("Test 3:", lengthOfLongestSubstring("pwwkew")); // Expected: 3 ("wke")`,
        python: `def lengthOfLongestSubstring(s: str) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", lengthOfLongestSubstring("abcabcbb"))  # Expected: 3 ("abc")
print("Test 2:", lengthOfLongestSubstring("bbbbb"))  # Expected: 1 ("b")
print("Test 3:", lengthOfLongestSubstring("pwwkew"))  # Expected: 3 ("wke")`,
        java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Your code here
        
    }
};`
    },
    'rotting-oranges': {
        javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
function orangesRotting(grid) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // Expected: 4
console.log("Test 2:", orangesRotting([[2,1,1],[0,1,1],[1,0,1]])); // Expected: -1
console.log("Test 3:", orangesRotting([[0,2]])); // Expected: 0`,
        python: `def orangesRotting(grid: list[list[int]]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", orangesRotting([[2,1,1],[1,1,0],[0,1,1]]))  # Expected: 4
print("Test 2:", orangesRotting([[2,1,1],[0,1,1],[1,0,1]]))  # Expected: -1
print("Test 3:", orangesRotting([[0,2]]))  # Expected: 0`,
        java: `class Solution {
    public int orangesRotting(int[][] grid) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        // Your code here
        
    }
};`
    },
    'search-in-rotated-sorted-array': {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", search([4,5,6,7,0,1,2], 0)); // Expected: 4
console.log("Test 2:", search([4,5,6,7,0,1,2], 3)); // Expected: -1
console.log("Test 3:", search([1], 0)); // Expected: -1`,
        python: `def search(nums: list[int], target: int) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", search([4,5,6,7,0,1,2], 0))  # Expected: 4
print("Test 2:", search([4,5,6,7,0,1,2], 3))  # Expected: -1
print("Test 3:", search([1], 0))  # Expected: -1`,
        java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Your code here
        
    }
};`
    },
    'fizz-buzz': {
        javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", fizzBuzz(3)); // Expected: ["1","2","Fizz"]
console.log("Test 2:", fizzBuzz(5)); // Expected: ["1","2","Fizz","4","Buzz"]
console.log("Test 3:", fizzBuzz(15));`,
        python: `def fizzBuzz(n: int) -> list[str]:
    # Your code here
    pass

# Test cases
print("Test 1:", fizzBuzz(3))  # Expected: ["1","2","Fizz"]
print("Test 2:", fizzBuzz(5))  # Expected: ["1","2","Fizz","4","Buzz"]
print("Test 3:", fizzBuzz(15))`,
        java: `class Solution {
    public List<String> fizzBuzz(int n) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    vector<string> fizzBuzz(int n) {
        // Your code here
        
    }
};`
    },
    'single-number': {
        javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function singleNumber(nums) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", singleNumber([2,2,1])); // Expected: 1
console.log("Test 2:", singleNumber([4,1,2,1,2])); // Expected: 4
console.log("Test 3:", singleNumber([1])); // Expected: 1`,
        python: `def singleNumber(nums: list[int]) -> int:
    # Your code here
    pass

# Test cases
print("Test 1:", singleNumber([2,2,1]))  # Expected: 1
print("Test 2:", singleNumber([4,1,2,1,2]))  # Expected: 4
print("Test 3:", singleNumber([1]))  # Expected: 1`,
        java: `class Solution {
    public int singleNumber(int[] nums) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        // Your code here
        
    }
};`
    },
    'valid-parentheses-demo': {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Your code here
    
}

// Test cases
console.log("Test 1:", isValid("()")); // Expected: true
console.log("Test 2:", isValid("()[]{}")); // Expected: true
console.log("Test 3:", isValid("(]")); // Expected: false`,
        python: `def isValid(s: str) -> bool:
    # Your code here
    pass

# Test cases
print("Test 1:", isValid("()"))  # Expected: True
print("Test 2:", isValid("()[]{}"))  # Expected: True
print("Test 3:", isValid("(]"))  # Expected: False`,
        java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
        
    }
}`,
        cpp: `class Solution {
public:
    bool isValid(string s) {
        // Your code here
        
    }
};`
    }
};

async function updateStarterCode() {
    try {
        await mongoose.connect(env.DB_URL);
        console.log('✅ Connected to MongoDB\n');

        const problems = await Problem.find({ isActive: true });
        console.log('Total problems in DB:', problems.length);

        let updatedCount = 0;
        let missingCount = 0;

        for (const p of problems) {
            const starterCode = STARTER_CODE_WITH_TESTS[p.id];
            if (starterCode) {
                await Problem.findByIdAndUpdate(p._id, {
                    $set: { starterCode: starterCode }
                });
                console.log('✅ Updated:', p.id);
                updatedCount++;
            } else {
                console.log('⚠️  No starter code defined for:', p.id);
                missingCount++;
            }
        }

        console.log('\n========================================');
        console.log('✅ Updated', updatedCount, 'problems with starter code + tests');
        if (missingCount > 0) {
            console.log('⚠️  Missing starter code for', missingCount, 'problems');
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateStarterCode();
