
#include <iostream>
#include <vector>
int main() {
    std::vector<int> vec;
    while(true) {
        vec.push_back(1); // Will eventually exceed memory
    }
    return 0;
}