var twoSum = function(nums, target) {
    const hashMap = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (hashMap.has(complement)) {
            return [hashMap.get(complement), i];
        }
        
        // Store the current number and its index for future lookups
        hashMap.set(nums[i], i);
    }
    
    // As per the problem description, each input has exactly one solution,
    // so the code should not reach this point.
    return []; 
};
// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]