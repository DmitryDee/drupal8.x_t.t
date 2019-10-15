##### MANUAL ERROR LOG

You dont need to create settings.local.php file. It runs site crash.
This block of code runs site crash
```php
  $config['system.performance']['css']['preprocess'] = FALSE;
  $config['system.performance']['js']['preprocess'] = FALSE;
```