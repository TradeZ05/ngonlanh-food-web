package com.ngonlanh.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ngonlanh.backend.entity.Category;
import com.ngonlanh.backend.entity.Order;
import com.ngonlanh.backend.entity.Product;
import com.ngonlanh.backend.repository.CategoryRepository;
import com.ngonlanh.backend.repository.OrderRepository;
import com.ngonlanh.backend.repository.ProductRepository;
import com.ngonlanh.backend.service.DashboardService;
import com.ngonlanh.backend.service.FileUploadService;
import com.ngonlanh.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.ngonlanh.backend.repository.UserRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    // ==========================================
    // KHAI BÁO CÁC SERVICE VÀ REPOSITORY
    // ==========================================
    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private ProductRepository productRepository; 

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    // ==========================================
    // CÁC API DÀNH CHO ADMIN
    // ==========================================

    // API 1: Test Admin
    @GetMapping("/test")
    public ResponseEntity<?> testAdminAccess() {
        return ResponseEntity.ok("Xin chào Chủ quán! Quyền lực Admin của bạn đã được xác nhận. Server chạy ngon lành!");
    }

    // API 2: Thống kê Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            return ResponseEntity.ok(dashboardService.getDashboardStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy dữ liệu Dashboard: " + e.getMessage());
        }
    }

    // API 3: Cập nhật trạng thái đơn hàng
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            return ResponseEntity.ok(orderService.updateOrderStatus(id, newStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật đơn hàng: " + e.getMessage());
        }
    }

    // API 4: Thêm sản phẩm kèm Upload ảnh
    @PostMapping(value = "/products", consumes = "multipart/form-data")
    public ResponseEntity<?> addProduct(
            @RequestPart("product") String productJson, 
            @RequestPart("file") MultipartFile file) { 
        try {
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productJson, Product.class);

            // Upload ảnh lên mây
            String url = fileUploadService.uploadFile(file);
            product.setImageUrl(url);

            return ResponseEntity.ok(productRepository.save(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi upload: " + e.getMessage());
        }
    }

    // API 5: Cập nhật thông tin món ăn
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setPrice(productDetails.getPrice());
            product.setDescription(productDetails.getDescription());
            product.setImageUrl(productDetails.getImageUrl()); 
            product.setCategory(productDetails.getCategory());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    // API 6: Xóa sản phẩm
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa sản phẩm thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa: " + e.getMessage());
        }
    }

    // API 7: Lấy dimage sách tất cả dimage mục
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // API 8: Thêm dimage mục mới
    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    // API 9: Xóa dimage mục
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        try {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa dimage mục!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa dimage mục đang có sản phẩm!");
        }
    }

    // API 10: Lấy dimage sách đơn hàng (Có thể lọc theo status)
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(@RequestParam(required = false) String status) {
        try {
            List<Order> orders;
            if (status != null && !status.isEmpty()) {
                orders = orderRepository.findByStatusOrderByOrderDateDesc(status);
            } else {
                orders = orderRepository.findAllByOrderByOrderDateDesc();
            }
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy dimage sách đơn hàng: " + e.getMessage());
        }
    }

    // Nhớ kéo lên đầu file AdminController.java và dán dòng import này vào nhé:
    // import com.ngonlanh.backend.repository.UserRepository;

    @Autowired
    private UserRepository userRepository;

    // API 11: Lấy dimage sách tất cả Người dùng
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi lấy dimage sách User: " + e.getMessage());
        }
    }

    // API 12: Khóa / Mở khóa tài khoản (Dùng biến 'enabled')
    @PutMapping("/users/{id}/toggle-lock")
    public ResponseEntity<?> toggleUserLock(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // Lấy trạng thái hiện tại (Nếu null thì mặc định là true)
            boolean currentStatus = user.getEnabled() != null ? user.getEnabled() : true;
            
            // Đảo ngược trạng thái (đang hoạt động -> khóa, đang khóa -> mở)
            user.setEnabled(!currentStatus);
            userRepository.save(user);
            
            String message = !currentStatus ? "Đã MỞ KHÓA tài khoản thành công!" : "Đã KHÓA tài khoản thành công! Tên này hết đường bom hàng.";
            return ResponseEntity.ok(message);
        }).orElse(ResponseEntity.notFound().build());
    }
}