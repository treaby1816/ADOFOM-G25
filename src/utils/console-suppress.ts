/**
 * Suppress noisy console errors from known browser extensions that are not bugs in the application.
 */
if (typeof window !== 'undefined') {
  const originalError = console.error;

  console.error = (...args: any[]) => {
    const firstArg = args[0];
    
    // Suppress Adobe Acrobat "Sender: Failed to get initial state" error
    if (
      typeof firstArg === 'string' && 
      (firstArg.includes('Sender: Failed to get initial state') || 
       firstArg.includes('epapihdplajcdnnkdeiahlgigofloibg'))
    ) {
      return;
    }

    originalError.apply(console, args);
  };
}

export {};
