package com.ngonlimage.backend.controller;

import com.ngonlimage.backend.entity.Category;
import com.ngonlimage.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // 1. Cửa GET: Lấy toàn bộ dimage mục trả về cho Frontend
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // 2. Cửa POST: Nhận dữ liệu từ Frontend để lưu xuống Database
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        // Hàm save() sẽ tự động tạo câu lệnh INSERT INTO... giống hệt bạn gõ lúc nãy
        return categoryRepository.save(category);
    }

    // Xóa dimage mục theo ID
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        categoryRepository.deleteById(id);
    }

    // Cập nhật dimage mục theo ID
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Integer id, @RequestBody Category categoryDetails) {
        // 1. Tìm dimage mục cũ trong DB
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dimage mục này!"));
        
        // 2. Ghi đè thông tin mới
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        
        // 3. Lưu lại
        return categoryRepository.save(category);
    }
}